#!/usr/bin/env node
import fastifyJwt from 'fastify-jwt';
import fastifyOas from 'fastify-oas';
import { readJsonFile } from '../core/utility';
import { TestLogger } from './runner-core/logger';
import { SystemTimeProvider } from './runner-core/models';
import * as path from 'path';
import * as fs from 'fs';
import { FastifyInstance } from 'fastify';
import { YaitdeUserRepo } from '../mock-server/users';
import { AppConfig } from '../core/config';
import { GitApi } from '../core/git-api/git-api';
import { LocalFileApi } from '../core/file-api/file-api';
import { YaitdeRepo } from '../core/yaitde-api/yaitde-repo';

import * as runnerApi from './routes/exec/run-test-api';
import * as runnerApi2 from './routes/exec/run-test-api2';
import * as importCollectionApi from './routes/import/import-pm-api';
import * as writeTestApi from './routes/test/write-test';
import * as getTestApi from './routes/test/get-test';
import * as deleteTestApi from './routes/test/delete-test';
import * as listTestApi from './routes/test/list-tests';

import * as writeEnvApi from './routes/env/write-env';
import * as getEnvApi from './routes/env/get-env';
import * as deleteEnvApi from './routes/env/delete-env';
import * as listEnvApi from './routes/env/list-envs';

import * as writeCollectionApi from './routes/collection/write-collection';
import * as getCollectionApi from './routes/collection/get-collection';
import * as deleteCollectionApi from './routes/collection/delete-collection';
import * as listCollectionApi from './routes/collection/list-collections';

import * as writeScriptApi from './routes/script/write-script';
import * as getScriptApi from './routes/script/get-script';
import * as deleteScriptApi from './routes/script/delete-script';
import * as listScriptApi from './routes/script/list-scripts';

import * as clearRepoApi from './routes/clear-repo';

export const serviceApi = (app: FastifyInstance, userRepo: YaitdeUserRepo, appConfig: AppConfig) => {
    console.log('service api startup');

    const configBasePath = "/usr/src/yaitde";
    const configFileName = "yaitde-config.json";

    const fastifyJwtOptions: any = {};

    if (process.env.SIGNING_KEY) {
        app.log.debug("using signing key from ENV");
        fastifyJwtOptions.secret = process.env.SIGNING_KEY;
    } else if (fs.existsSync("key.json")) {
        app.log.debug("using signing key from app root");
        fastifyJwtOptions.secret = readJsonFile("", "key.json").key;
    } else if (fs.existsSync(path.join(appConfig.systemPath, "key.json"))) {
        app.log.debug("using signing key from system root");
        fastifyJwtOptions.secret = readJsonFile(appConfig.systemPath, "key.json").key;
    } else {
        app.log.debug("using developer signing key");
        fastifyJwtOptions.secret = "$#%Developer#%$$";
    }

    app.register(fastifyJwt, fastifyJwtOptions);

    app.register(fastifyOas, {
        routePrefix: '/api/docs',
        swagger: {
            info: {
                title: 'Get Off My Lawn!',
                description: 'mocks and such',
                version: '0.0.1'
            },
            externalDocs: {
                url: 'https://kb.yaitde.io',
                description: 'stuff blah'
            },
            host: 'api.getoffmylawn.xyz',
            schemes: ['https'],
            consumes: ['application/json'],
            produces: ['application/json'],
            tags: [
                { name: 'api', description: 'Yaitde Api' }
            ],
            security: ["bearer"],
            securityDefinitions: {
                //bearer: {}
                BearerAuth: {
                    type: "http",
                    scheme: "bearer"
                },
                apiKey: {
                    type: 'apiKey',
                    name: 'apiKey',
                    in: 'header'
                }
            }
        },
        exposeRoute: true,
        exposeModels: true
    });

    const timeProvider = new SystemTimeProvider();
    const logger = new TestLogger(timeProvider);

    const environment = { repoPath: appConfig.userRepoRoot };
    const gitApi = new GitApi(logger, environment);
    const fileApi = new LocalFileApi(logger, environment);
    const yaitdeRepo = new YaitdeRepo(logger, fileApi, appConfig.userRepoRoot);

    const appContext = {
        shutdown: false,
        gitApi: gitApi,
        fileApi: fileApi,
        yaitdeRepo: yaitdeRepo,
        envVars: environment,
        logger: logger,
        version: '.1'
    };

    runnerApi.default(app, logger, appConfig);
    runnerApi2.default(app, logger);
    importCollectionApi.default(app, logger, appConfig);

    writeTestApi.default(app, logger, appConfig);
    getTestApi.default(app, logger, appConfig);
    deleteTestApi.default(app, logger, appConfig);
    listTestApi.default(app, logger, appConfig);

    writeEnvApi.default(app, logger, appConfig);
    getEnvApi.default(app, logger, appConfig);
    deleteEnvApi.default(app, logger, appConfig);
    listEnvApi.default(app, logger, appConfig);

    writeCollectionApi.default(app, logger, appConfig);
    getCollectionApi.default(app, logger, appConfig);
    deleteCollectionApi.default(app, logger, appConfig);
    listCollectionApi.default(app, logger, appConfig);

    writeScriptApi.default(app, logger, appConfig);
    getScriptApi.default(app, logger, appConfig);
    deleteScriptApi.default(app, logger, appConfig);
    listScriptApi.default(app, logger, appConfig);

    clearRepoApi.default(app, logger, appConfig);

    app.listen(3000, "0.0.0.0", (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });

    process.on('SIGTERM', () => {
        app.close(() => {
            console.log('api terminated')
        })
    });

    process.on('SIGINT', () => {
        app.close(() => {
            console.log('api terminated')
        })
    });
};
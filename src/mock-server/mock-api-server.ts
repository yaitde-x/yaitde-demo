
import { FastifyInstance } from 'fastify';
import fastifyJwt from 'fastify-jwt';
import fastifyOas from 'fastify-oas';
import fastifyFormBody from 'fastify-formbody';
import autoload from 'fastify-autoload';
import fs from 'fs';
import path from 'path';
import { YaitdeUserRepo } from './users';
import { readJsonFile } from '../core/utility';
import { AppConfig } from '../core/config';

const audience: string = "api.getoffmylawn.xyz";
const issuer: string = "api.getoffmylawn.xyz";

export const mockServer = (app: FastifyInstance, userRepo: YaitdeUserRepo, appConfig: AppConfig) : void => {
    
    app.log.debug("booting mock server");

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
    app.register(fastifyFormBody);

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
                { name: 'mock', description: 'Mock Api end-points' },
                { name: 'api', description: 'Test Api end-points' }
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

    app.register(autoload, {
        dir: path.join(__dirname, "routes")
    });

    app.listen(3000, "0.0.0.0", (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`mock server listening at ${address}`);
    });

    process.on('SIGTERM', () => {
        app.close(() => {
            console.log('mock server terminated')
        })
    });

    process.on('SIGINT', () => {
        app.close(() => {
            console.log('mock server terminated')
        })
    });
}
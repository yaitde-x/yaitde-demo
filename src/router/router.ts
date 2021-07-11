import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt from 'fastify-jwt';
import fastifyOas from 'fastify-oas';
import fastifyCookie, { FastifyCookieOptions } from 'fastify-cookie';
import fastifyFormBody from 'fastify-formbody';
import fs from 'fs';
import path from 'path';
import { YaitdeUserRepo } from '../mock-server/users';
import { readJsonFile } from '../core/utility';
import { v4 as uuidv4 } from 'uuid';
import { default as axios } from 'axios';
import { AppConfig } from '../core/config';
import { Orchestrator } from './orchestration/orchestrator';
import { ShellRunner } from "./orchestration/shell-runner";
import * as ghCustomApi from './routes/github-ops-custom';
import * as ghEventApi from './routes/github-ops-event';
import * as ovListAppsApi from './routes/overseer-ls-apps';
import * as ovRemoveAppApi from './routes/overseer-rm-apps';
import * as orchGetContainers from './routes/orch-ls-containers';
import * as orchGetImages from './routes/orch-ls-images';
import * as orchGetNetworks from './routes/orch-ls-networks';

import sleep from 'sleep-promise';
import { TheOverseer } from './orchestration/overseer';
import { audience, issuer } from '../core/const';
import { extractHostnameOnly, extractQueryParameter } from '../core/fastify-utilities';

export const serviceRouter = async (app: FastifyInstance, userRepo: YaitdeUserRepo,
    appConfig: AppConfig, orchestrator: Orchestrator, theOverseer: TheOverseer) : Promise<void> => {

    app.log.debug("booting router");

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
    app.register(fastifyCookie, {
        secret: "yaitde-dev-secret"
    });

    app.register(fastifyOas, {
        routePrefix: '/sys/docs',
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

    const shouldAuth = (url: string): boolean => {
        return !url.toLowerCase().startsWith("/auth") &&
            !url.toLowerCase().startsWith("/app") &&
            !url.toLowerCase().startsWith("/api/ops/gh");
    };

    const isApp = (req: FastifyRequest): boolean => {
        return (req.headers["user-agent"].indexOf("AppleWebKit") > -1 ||
            req.headers["user-agent"].indexOf("Firefox") > -1);
    };

    app.addHook("onRequest", async (request, reply) => {
        try {
            const url = request.url;
            if (!isApp(request) && shouldAuth(url)) {
                await request.jwtVerify({
                    audience: audience
                });
            }
        } catch (err) {
            reply.send(err)
        }
    });

    app.decorateReply('locals', { user: null })

    // app.addHook('preHandler', function (req, reply, next) {
    //     reply.locals.user = req.body.user
    //     next()
    // })

    app.post('/auth', {
        schema: {
            body: readJsonFile(appConfig.schemaRepoPath, 'token-req.json'),
            response: {
                200: readJsonFile(appConfig.schemaRepoPath, 'token-resp.json')
            }
        }
    }, (req, reply) => {

        const userId = (<any>req.body).userId;
        const secret = (<any>req.body).secret;
        const user = userRepo.getUser(userId, secret);

        if (user) {

            const payload = { ...(<any>req.body), ...user };
            delete payload.secret;

            const token = app.jwt.sign(payload, {
                expiresIn: "1h",
                audience: audience,
                issuer: issuer,
                jwtid: uuidv4(),
                subject: userId
            });
            reply.send({ token: token });
            return;
        }

        reply.status(401).send();
    });

    // register routes in separate files
    ghCustomApi.default(app, theOverseer);
    ghEventApi.default(app);
    ovListAppsApi.default(app, theOverseer);
    ovRemoveAppApi.default(app, theOverseer, orchestrator);
    orchGetContainers.default(app, orchestrator);
    orchGetImages.default(app, orchestrator);
    orchGetNetworks.default(app, orchestrator);

    app.post('/api/ops/diag', {
    }, async (req, reply) => {

        try {
            const command = <string>(<any>req.body).command;
            const params = <string[]>(<any>req.body).params;
            const env = <any>(<any>req.body).env;

            const shell = new ShellRunner(appConfig.automationPath);
            const result = await shell.runProcess(command, params, env);
            reply.send(result);
            return;
        } catch (e) {
            reply.status(400).send(e);
        }
    });

    app.post('/api/ops/up', {
    }, async (req, reply) => {

        try {
            const appName = <string>req.headers["x-yaitde-application"];
            const orchestrationResult = await orchestrator.orchestrateApplication(appName);

            const resp = orchestrationResult.success ?
                { result: "success", messages: orchestrationResult.messages } :
                { result: "orchestration-failed", messages: orchestrationResult.messages };

            reply.status(orchestrationResult.success ? 201 : 500).send(resp);
            return;
        } catch (e) {
            reply.status(400).send(e);
        }
    });

    app.post('/api/ops/down', {
    }, async (req, reply) => {

        try {
            const appName = <string>req.headers["x-yaitde-application"];
            const orchestrationResult = await orchestrator.destroyApplication(appName);

            const resp = orchestrationResult.success ?
                { result: "success", messages: orchestrationResult.messages } :
                { result: "orchestration-failed", messages: orchestrationResult.messages };

            reply.status(orchestrationResult.success ? 200 : 500).send(resp);
            return;
        } catch (e) {
            reply.status(400).send(e);
        }
    });

    const resolveAppId = (req: FastifyRequest, reply: FastifyReply): string => {
        const queryAppId: string = req.query["appId"] ?? undefined;
        let cookieAppId: string | boolean;
        
        if (req.cookies["appId"])
            cookieAppId = reply.unsignCookie(req.cookies["appId"]);

        app.log.debug(`appId from cookie : ${cookieAppId}`);
        let appId = <string>req.headers["x-yaitde-application"] ?? queryAppId;

        if (!appId && cookieAppId && typeof cookieAppId === "string")
            appId = cookieAppId as string;

        if (!appId && req.headers["referer"]) {
            app.log.debug(`no appid so far, looking at referer : ${req.headers["referer"]}`);
            appId = extractQueryParameter("appId", req.headers["referer"]);
        }

        if (!appId) {
            appId = "yaitde-app-latest";
            app.log.debug(`no appid could be resolved so defaulting to : ${appId}`);
        }

        app.log.debug(`pipeline will be using appId : ${appId}...`);
        return appId;
    };

    app.all('/*', {
    }, async (req, reply) => {
        try {
            const messages = [];
            const headers = req.headers;
            app.log.debug(headers, "headers:");

            app.log.debug("resolving app id");
            const appName = resolveAppId(req, reply);
            
            if (!appName) {
                reply
                    .status(500)
                    .send({ result: "appId is required", messages: [] });
                return;
            }

            headers["x-yaitde-application"] = appName;

            const userBuffer = JSON.stringify(req.user);
            app.log.debug(`got user: ${userBuffer}`);

            if (userBuffer)
                headers["x-yaitde-user"] = Buffer.from(userBuffer).toString('base64');

            // here we need to resolve to a name and port
            const orchestrationResult = await orchestrator.orchestrateApplication(appName);

            if (orchestrationResult.success) {
                const appEntry = orchestrationResult.appEntry;
                app.log.debug(`appEntry: ${JSON.stringify(appEntry)}`);

                if (!appEntry) {
                    reply
                        .status(500)
                        .send({ result: "appentry-missing", messages: orchestrationResult.messages });
                    return;
                }

                const url = req.url;

                app.log.debug(`forwarding to: ${url}`);

                const options = {
                    url: url,
                    baseURL: `http://${appEntry.name}:${appEntry.port}`,
                    method: <any>req.method,
                    query: <any>req.query,
                    headers: req.headers,
                    params: req.params,
                    data: req.body
                };

                let retries = 0;
                let keepTrying = true;
                let lastError;

                while (keepTrying && retries < 5) {
                    try {
                        retries++;

                        app.log.debug("relaying...");
                        app.log.debug(JSON.stringify(options));

                        const resp = await axios.request(options);

                        if (resp) {
                            app.log.debug(`sending response with cookie ${appName}`);
                            reply
                                .status(resp.status)
                                .headers(resp.headers)
                                .setCookie('appId', appName, {
                                    domain: extractHostnameOnly(req.hostname),
                                    signed: true,
                                    sameSite: "lax"
                                })
                                .send(resp.data);
                            keepTrying = false;
                            return;
                        } else
                            await sleep(300);

                    } catch (innerError) {
                        lastError = innerError;

                        if (innerError.code !== "ECONNREFUSED")
                            keepTrying = false;
                        else {
                            const jsonError = JSON.stringify(innerError);
                            messages.push(jsonError);
                            app.log.debug(jsonError);
                            await sleep(300);
                        }
                    }
                }

                if (lastError && lastError.code === "ECONNREFUSED") {
                    reply
                        .status(504)
                        .send({ result: "comms-failed", messages: [...messages, ...orchestrationResult.messages] });
                } else if (lastError && lastError.response) {
                    reply
                        .status(lastError.response.status)
                        .send({ result: "request-failed", messages: [lastError.response.statusText] });
                } else {
                    reply
                        .status(502)
                        .send({ result: "dunno", messages: [...messages, ...orchestrationResult.messages] });
                }
            } else {
                reply
                    .status(550)
                    .send({ result: "orchestration-failed", messages: orchestrationResult.messages });
            }

        } catch (error) {
            app.log.error(error, "totally-bork");
            if (error.response) {
                reply
                    .status(error.response.status)
                    .send({ result: "request-failed", messages: [error.response.statusText] });
            } else {
                reply
                    .status(500)
                    .send({ result: "totally-borked", messages: [JSON.stringify(error)] });
            }
        }
    });

    app.listen(3000, "0.0.0.0", (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`router listening at ${address}`);
    });

    process.on('SIGTERM', () => {
        app.close(() => {
            console.log('router terminated')
        })
    });

    process.on('SIGINT', () => {
        app.close(() => {
            console.log('router terminated')
        })
    });
};
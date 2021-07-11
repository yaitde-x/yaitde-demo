import fastify from 'fastify';
import { YaitdeUserRepo } from './mock-server/users';
import { mockServer } from './mock-server/mock-api-server';
import { serviceRouter } from './router/router';
import { serviceConsole } from './console/console';
import { serviceApi } from './api/api';
import commander from 'commander';
import { appConfig } from './core/config';
import { Orchestrator } from './router/orchestration/orchestrator';
import { TheOverseer } from './router/orchestration/overseer';

const userRepo = new YaitdeUserRepo(appConfig);
const app = fastify({
    logger: {
        level: "debug",
        prettyPrint: true
    }
});

commander
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('-m, --mock', 'Run as a mock api server')
    .option('-r, --router', 'Run as a router')
    .option('-s, --stub', 'console docker stub')
    .option('-a, --api', 'Run as a api')
    .option('-c, --console', 'Run as the console')
    .parse(process.argv);

const theOverseer = new TheOverseer(appConfig.systemPath);
const orchestrator = new Orchestrator(appConfig.automationPath);

if (commander.mock)
    mockServer(app, userRepo, appConfig);
else if (commander.router)
    serviceRouter(app, userRepo, appConfig,
        orchestrator,
        theOverseer);
else if (commander.stub)
    process.exit(0);
else if (commander.console)
    serviceConsole();
else if (commander.api)
    serviceApi(app, userRepo, appConfig);
else
    console.log('invalid option');
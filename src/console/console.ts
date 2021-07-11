#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { ConsoleLogger } from '../core/utility/logger';
import { GitApi } from '../core/git-api/git-api';
import { OutputWriter, DefaultTheme } from './console-core/output-writer';
import { ICommandDispatcher } from './console-core/command/parse-interfaces';
import { CommandDispatcher } from "./console-core/command/command-dispatcher";
import { CommandParser } from "./console-core/command/command-parser";
import { registerCommands } from './console-core/command-registration';
import { LocalFileApi } from '../core/file-api/file-api';
import { RunnerApi } from '../core/runner-api/runner-api';
import { AppConfig, YaitdeConfig } from '../core/config';
import { OutlineApi } from "../core/import-api/outline-api";
import { HttpClient } from '../core/http-api/http-api';
import { YaitdeRepo } from '../core/yaitde-api/yaitde-repo';
import { userRepoPathFactory } from '../core/utility/factories';

const prompt = require('prompt-sync');
const promptHistory = require('prompt-sync-history');

export const serviceConsole = async () => {
    const autoComplete = () => {
        return [
            'git status',
            'git branch',
            'quit',
            'clear'
        ];
    };

    const configBasePath = "/usr/src/yaitde";
    const configFileName = "config.json";

    const logger = new ConsoleLogger();
    const repo = 'test-repo';
    const myPrompt = prompt({ sigint: true, history: promptHistory(), autocomplete: autoComplete });

    // default config here
    let yaitdeConfig: AppConfig = <AppConfig>{};
    const configHomePath = path.join(configBasePath, configFileName);

    if (fs.existsSync(configFileName))
        yaitdeConfig = JSON.parse(fs.readFileSync(configFileName).toString());
    else if (fs.existsSync(configHomePath))
        yaitdeConfig = JSON.parse(fs.readFileSync(configHomePath).toString());

    const environment = { 
        repo: repo, 
        user: "eo@yaitde.com",
        userRepoRoot: yaitdeConfig.userRepoRoot
    };

    const gitApi = new GitApi(logger, environment);
    const fileApi = new LocalFileApi(logger, environment);
    const runnerApi = new RunnerApi(logger, yaitdeConfig.runnerConfig, environment);
    const repo_root = userRepoPathFactory(yaitdeConfig.userRepoRoot, environment.user, 'default', repo)
    const yaitdeRepo = new YaitdeRepo(logger, fileApi, repo_root);
    const outlineApi = new OutlineApi(logger, new HttpClient(logger), yaitdeConfig.outlineConfig);

    const appContext = {
        shutdown: false,
        gitApi: gitApi,
        fileApi: fileApi,
        outlineApi: outlineApi,
        runnerApi: runnerApi,
        yaitdeRepo: yaitdeRepo,
        envVars: environment,
        logger: logger,
        version: '.1'
    };

    const commandParser = new CommandParser();
    const dispatcher: ICommandDispatcher = new CommandDispatcher();

    registerCommands(dispatcher, appContext);

    const theme = new DefaultTheme();
    const writer = new OutputWriter(theme);

    const replLoop = async () => {

        logger.info('entering command loop...');

        while (!appContext.shutdown) {

            try {
                const prompt = writer.getPrompt();
                const commandLine: string = myPrompt(prompt).trim();

                if (commandLine === '')
                    continue;

                const parsedCommand = commandParser.parse(commandLine);
                const command = dispatcher.resolveCommand(parsedCommand);

                if (command) {
                    const result = await command.vector(parsedCommand, commandLine);

                    if (result)
                        writer.info(result);

                } else
                    writer.error('invalid command');

            } catch (error) {
                writer.error(JSON.stringify(error));
            } finally {
                myPrompt.history.save();
            }
        }
    };

    console.log('service console startup');
    replLoop()
        .then(() => {
            writer.info("exiting");
        })
        .catch((e) => { writer.error(e) });
};




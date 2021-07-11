import { readJsonFile } from './utility';
import path from 'path';

export interface YaitdeRunnerConfig {
    path : string;
}

export interface OutlineConfig {
    url : string;
    apiKey:string;
}

export interface YaitdeConfig {
    runnerConfig : YaitdeRunnerConfig;
    outlineConfig: OutlineConfig;
}

export interface AppConfig {
    systemPath: string;
    mockRepoPath: string;
    schemaRepoPath: string;
    automationPath: string;
    userRepoRoot: string;
    
    runnerConfig : YaitdeRunnerConfig;
    outlineConfig: OutlineConfig;
}

export const appConfig: AppConfig = readJsonFile("", "config.json");

export const getBasePathForDomain = (domain: string): string => {
    if (domain.toLowerCase() === "schemas")
        return appConfig.schemaRepoPath;

    return path.join(appConfig.mockRepoPath, domain);
};
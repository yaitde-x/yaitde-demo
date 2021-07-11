import * as path from 'path';
import * as fs from 'fs';
import cache from 'memory-cache';
import { ShellRunner } from './shell-runner';

export class AppEntry {
    name: string;
    port: number;
}

export interface AutomationOpResult<T> {
    success: boolean;
    result?: T;
    messages: string[];
}

export interface AppContainer {
    command: string;
    createdAt: string;
    id: string;
    image: string;
    labels: string;
    localVolumes: string;
    mounts: string;
    names: string;
    networks: string;
    ports: string;
    runningFor: string;
    size: string;
    status: string;
}

export interface AppImage {
    containers: string;
    createdSince: string;
    digest: string;
    id: string;
    repository: string;
    sharedSize: string;
    size: string;
    tag: string;
    uniqueSize: string;
    virtualSize: string;
}

export interface AppNetwork {
    name: string;
    scope: string;
    internal: string;
    id: string;
    ipv6: string;
    driver: string;
    createAt: string;
    labels: string;
}

export interface OrchestrationResult {
    success: boolean;
    messages: string[];
    appEntry?: AppEntry;
}

export class Orchestrator {

    private _appIndex: any = {
        "local": { name: "localhost", port: 3003 },
        "yaitde-app": { name: "yaitde-app", port: 80 }
    };

    _shellRunner: ShellRunner;
    _automationRoot: string;

    constructor(automationRoot: string) {
        this._automationRoot = automationRoot;
        this._shellRunner = new ShellRunner(automationRoot);
    }

    public async orchestrateApplication(appName: string): Promise<OrchestrationResult> {

        this.ensureComposeFileExists(appName);

        const runningCheckResult = await this.isApplicationRunning(appName);
        const port = appName.startsWith("yaitde-app") ? 80 : 3000;

        if (runningCheckResult.success && runningCheckResult.result) {
            return { success: true, messages: [], appEntry: { name: appName, port: port } };
        } else if (runningCheckResult.success && !runningCheckResult.result) {
            const appUpResult = await this.applicationUp(appName);

            if (appUpResult.success) {
                return { success: true, messages: [], appEntry: { name: appName, port: port } };
            }
            return { success: false, messages: [...runningCheckResult.messages, ...appUpResult.messages] };
        }

        return { success: false, messages: runningCheckResult.messages };
    }

    private ensureComposeFileExists(appName: string): void {
        const composeFile = this.getComposeFileName(appName);
        const targetFile = path.join(this._automationRoot, "compose", "runtime", composeFile);

        if (!fs.existsSync(targetFile)) {
            const sourceFile = path.join(this._automationRoot, "compose", "docker-cmp-agent.yml");
            let appComposeFile = fs.readFileSync(sourceFile)
                .toString();

            appComposeFile = appComposeFile.replace("yaitde-agent-svc-name", appName);
            appComposeFile = appComposeFile.replace("yaitde-agent-net", `${appName}-net`);
            appComposeFile = appComposeFile.replace("yaitde-agent-net:", `${appName}-net:`);

            fs.writeFileSync(targetFile, appComposeFile);
        }
    }
    private getComposeFileName(appName: string) {
        return `dckr-cmp-${appName}.yml`;
    }

    public async destroyApplication(appName: string): Promise<OrchestrationResult> {

        const appDownResult = await this.applicationDown(appName);

        if (appDownResult.success) {
            return { success: true, messages: [] };
        }
        return { success: false, messages: appDownResult.messages };
    }

    public async Login(): Promise<AutomationOpResult<void>> {

        const processResults =
            await this._shellRunner.runProcess("./login.sh", [], {});

        return { success: processResults.status === 0, messages: [processResults.result] };
    }

    public async getContainers(): Promise<AutomationOpResult<AppContainer[]>> {

        const shellResult =
            await this._shellRunner.runProcess("./docker-containers.sh", [], {});

        console.log(shellResult);
        if (shellResult.status === 0) {
            const results: AppContainer[] = JSON.parse(shellResult.result);
            return { success: true, messages: [shellResult.result], result: results };
        }

        return { success: false, messages: [shellResult.result] };
    }

    public async getImages(): Promise<AutomationOpResult<AppImage[]>> {

        const shellResult =
            await this._shellRunner.runProcess("./docker-images.sh", [], {});

        console.log(shellResult);
        if (shellResult.status === 0) {
            const results: AppImage[] = JSON.parse(shellResult.result);
            return { success: true, messages: [shellResult.result], result: results };
        }

        return { success: false, messages: [shellResult.result] };
    }

    public async getNetworks(): Promise<AutomationOpResult<AppNetwork[]>> {

        const shellResult =
            await this._shellRunner.runProcess("./docker-networks.sh", [], {});

        console.log(shellResult);
        if (shellResult.status === 0) {
            const results: AppNetwork[] = JSON.parse(shellResult.result);
            return { success: true, messages: [shellResult.result], result: results };
        }

        return { success: false, messages: [shellResult.result] };
    }

    public async isApplicationRunning(appName: string): Promise<AutomationOpResult<boolean>> {

        const cachedRunning = <AutomationOpResult<boolean>>cache.get(appName);

        if (cachedRunning)
            return cachedRunning;

        const checkForContainerResult =
            await this._shellRunner.runProcess("docker",
                ["ps", `-f name=${appName}`, "--format", '"{{json .}}"'],
                this.appNameToEnvironment(appName));

        const messages: string[] = [];
        if (checkForContainerResult && checkForContainerResult.status === 0) {

            console.log(`got result: ${JSON.stringify(checkForContainerResult)}`);

            if (checkForContainerResult.result && checkForContainerResult.result.length > 0) {

                if (checkForContainerResult.result.indexOf('"' + appName + '"') > -1) {
                    console.log(`app ${appName} is already up`);
                    const result =  { success: true, result: true, messages: messages };
                    cache.put(appName, result, 1000);
                    return result;
                }
            }
            return { success: true, result: false, messages: messages };
        }
        else
            messages.push(checkForContainerResult.result);

        console.log(`app ${appName} is not currently up`);
        return { success: true, result: false, messages: messages }
    }

    private appNameToEnvironment(appName: string): any {
        // example appName: yaitde-mock-master-63
        // export AGENT_TYPE=mock
        // export APP_ID=master-63
        // export RUN_MODE=-m
        const parts = appName.split("-");
        const agentType = parts[1];
        const tagName = parts.slice(2, parts.length).join("-");

        const env = {
            "APP_ID": tagName,
            "AGENT_TYPE": agentType,
            "RUN_MODE": this.agentTypeToRunMode(agentType)
        };

        console.log(JSON.stringify(env));
        return env;
    }

    private agentTypeToRunMode(agentType: string): string {
        if (agentType.toLowerCase() === "mock")
            return "-m";
        if (agentType.toLowerCase() === "api")
            return "-a";

        return "-badoption";
    }

    public async applicationUp(appName: string): Promise<AutomationOpResult<void>> {
        console.log(`running application up for ${appName}`);

        const loginResult = await this.Login();
        if (!loginResult.success) {
            return { success: loginResult.success, messages: loginResult.messages };
        }

        const composeResult =
            await this._shellRunner.runProcess("docker-compose", ["-f", `./runtime/${this.getComposeFileName(appName)}`, "up", "-d"], this.appNameToEnvironment(appName));
        if (composeResult && composeResult.status === 0) {
            const routerConnectedResult =
                await this.addContainerToNetwork(appName, "yaitde-agent-router", `${appName}-net`);

            if (!routerConnectedResult.success) {
                const appDownResult = await this.applicationDown(appName);
                return { success: false, messages: appDownResult.messages };
            }

            return { success: true, messages: [] };
        }

        return { success: false, messages: [composeResult.result] };
    }

    public async removeImage(imageName: string): Promise<AutomationOpResult<void>> {
        const shellResult =
            await this._shellRunner.runProcess("docker"
                , ["image", "rm", imageName]
                , {});

        return { success: shellResult.status === 0, messages: [shellResult.result] };
    }

    public async addContainerToNetwork(appName: string, containerName: string, networkName: string): Promise<AutomationOpResult<void>> {
        const shellResult =
            await this._shellRunner.runProcess("docker"
                , ["network", "connect", networkName, containerName]
                , this.appNameToEnvironment(appName));

        return { success: shellResult.status === 0, messages: [shellResult.result] };
    }

    public async removeContainerFromNetwork(appName: string, containerName: string, networkName: string): Promise<AutomationOpResult<void>> {
        const shellResult =
            await this._shellRunner.runProcess("docker"
                , ["network", "disconnect", networkName, containerName]
                , this.appNameToEnvironment(appName));

        return { success: shellResult.status === 0, messages: [shellResult.result] };
    }

    public async applicationDown(appName: string): Promise<AutomationOpResult<void>> {
        console.log(`running application down for ${appName}`);

        const loginResult = await this.Login();
        if (!loginResult.success) {
            return { success: loginResult.success, messages: loginResult.messages };
        }

        const networkDownResult = await this.removeContainerFromNetwork(appName, "yaitde-agent-router", `${appName}-net`)
        const shellResult = await this._shellRunner.runProcess("docker-compose", ["-f", `./runtime/${this.getComposeFileName(appName)}`, "down"], this.appNameToEnvironment(appName));

        return { success: shellResult.status === 0, messages: [...networkDownResult.messages, shellResult.result] };
    }
}
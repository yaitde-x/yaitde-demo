import spawnAsync from '@expo/spawn-async';
import * as path from 'path';

export interface ShellResults {
    status: number;
    result: string;
    all?: any;
}

export class ShellRunner {
    _automationRoot: string;

    constructor(automationRoot: string) {
        this._automationRoot = automationRoot;
    }

    public async runProcess(app: string, params: string[], env: any): Promise<ShellResults> {

        console.log(`running: ${app + " " + params.join(" ")} with env:`);
        console.log(JSON.stringify(env));

        const runPromise = spawnAsync(app, params, {
            cwd: path.join(this._automationRoot, "compose"),
            env: env
        });

        try {
            const result = await runPromise;
            const resp = {
                status: result.status, 
                result: result.status === 0 ? result.stdout : result.stderr,
                all: result
            };
            return resp;
        } catch (e) {
            return { status: 1, result: JSON.stringify(e) };
        }
    }
}

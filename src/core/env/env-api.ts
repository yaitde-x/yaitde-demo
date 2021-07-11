import { ILogger } from "../utility/logger";
import { RuntimeContext, Environment } from "./env-interfaces";
import { IKeyedCollection, KeyedCollection } from "../utility/dictionary";

/**
 * @typedef {Object} EnvironmentManager
 * 
 * The EnvironmentManager is the guy that manages collections of environments and 
 * 'flattens' a Runtime context from multiple environments to a single effective environment.
 * 
 */
export class EnvironmentManager {
    //private _logger: ILogger;
    private _envs: IKeyedCollection<Environment>;

    constructor(logger: ILogger) {
        //this._logger = logger;
        this._envs = new KeyedCollection<Environment>();
    }

    /**
    * Add an environment to the manager
    * @param {Environment} env environment to add.
    * @returns {void} 
    */
    public addEnvironment(env: Environment): void {
        this._envs.add(env.id, env);
    }

    public removeEnvironment(envNameOrId: string): void {
        this._envs.remove(envNameOrId);
    }

    // private getEnv(envNameOrId: string): Environment {
    //     return this._envs.item(envNameOrId);
    // }

    public getEffectiveEnvironment(context: RuntimeContext) : Environment {
        let effectiveEnv = <Environment>{};
        context.environments.forEach((envName: string) => {
            const e = {};
            effectiveEnv = {...e, ...effectiveEnv};
        });

        return effectiveEnv;
    }
}
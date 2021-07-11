import { KeyedCollection } from "../../../core/utility/dictionary";

export type CommandHandler = (parseTree: IParseTree, command: string) => Promise<string>;
export type CommandVectorFactory = () => ICommandVector;
export const NullCommand: CommandHandler = (parseTree: IParseTree, command: string) => {
    return new Promise((resolve, reject) => {
        resolve("");
    });
};

export interface ICommandDispatcher {
    registerHandler(vector: ICommandVector): void;
    resolveCommand(parseTree: IParseTree): ICommandVector;
    getHelp(contains?: string): any;
}

export interface CommandParameterHelp {
    parameter: string;
    description: string;
    required?: boolean;
}

export interface CommandTokenHelp {
    token: number;
    description: string;
    required?: boolean;
}

export interface CommandHelp {
    description: string;
    example?: string;
    params?: CommandParameterHelp[]
    tokens?: CommandTokenHelp[]
}

export interface ICommandVector {
    command: string;
    vector?: CommandHandler;
    childCommands?: KeyedCollection<ICommandVector>;
    help?: CommandHelp
}

export interface IParseTree {
    rawValue: string;
    tokens: string[];
    switches: KeyedCollection<string>;
    getRequiredSwitch(key: string): string;
    tryGetSwitch(key: string): string;
    tryGetSwitch(key: string, defaultValue: string): string;
    switchExists(key: string): boolean;
}

export class CommandSwitch {

    switch: string;
    required: boolean;
    defaultVal: string;
    description: string;

    constructor();
    constructor(switchName?: string);
    constructor(switchName?: string, required?: boolean)
    constructor(switchName?: string, required?: boolean, description?: string)
    constructor(switchName?: string, required?: boolean, description?: string, defaultVal?: string) {
        this.switch = switchName;
        this.required = required;
        this.description = description;
        this.defaultVal = defaultVal;
    }
}
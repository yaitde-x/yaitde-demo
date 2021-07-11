
import { ICommandVector, ICommandDispatcher, IParseTree } from './parse-interfaces';

export class CommandDispatcher implements ICommandDispatcher {


    private _commandVectors: any;

    constructor() {
        this._commandVectors = {};
    }

    public getHelp(contains?: string): any {
        const helpStructure: any = {};

        for (const commandName in this._commandVectors) {
            const command: any = <any>this._commandVectors[commandName];

            if (!contains || commandName.toLowerCase().indexOf(contains.toLowerCase()) > -1) {
                if (command.command) {
                    const commandText: string = command.command;
                    helpStructure[commandText] = this.processCommandHelp(command);
                }
            }
        }

        return helpStructure;
    }

    private processCommandHelp(obj: any): any {
        const commandHelp: any = { command: obj.command, ...obj.help };

        if (obj.childCommands) {
            const children: any = {};

            for (const childCommand in obj.childCommands.items) {
                const command: any = <any>obj.childCommands.items[childCommand];
                children[childCommand] = { command: command.command, ...command.help };

                if (command.childCommands) {
                    children[childCommand] = this.processCommandHelp(command);
                }
            }
            commandHelp["sub commands"] = children;
        }

        return commandHelp;
    }

    public registerHandler(vector: ICommandVector): void {
        this._commandVectors[vector.command] = vector;
    }


    public resolveCommand(parseTree: IParseTree): ICommandVector {
        if (parseTree.tokens.length == 0)
            throw {
                name: "InvalidCommandFormat",
                level: "error",
                message: "invalid command"
            };

        const commandToken = parseTree.tokens[0];

        // Here we will pass to the server, eventually
        if (!this._commandVectors[commandToken])
            throw {
                name: "InvalidCommand",
                level: "error",
                message: "invalid command"
            };

        const topCommand = this._commandVectors[commandToken];
        const resolvedVector = this.findBestMatch(topCommand, parseTree.tokens);

        return resolvedVector;
    }


    private findBestMatch(vector: ICommandVector, tokens: string[]): ICommandVector {

        const slicedTokens = tokens.slice(1);

        if (slicedTokens.length === 0 || !vector)
            return vector;

        if (vector.childCommands && vector.childCommands.containsKey(slicedTokens[0])) {
            const childVector = vector.childCommands.item(slicedTokens[0]);
            return this.findBestMatch(childVector, slicedTokens);
        }
        else
            return vector;
    }

}

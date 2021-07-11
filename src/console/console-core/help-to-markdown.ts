
import { CommandParameterHelp, CommandTokenHelp } from "../console-core/command/parse-interfaces";
import { MarkDownDecorator, MarkDownTable } from "../../core/utility/markdown-writer";

export class HelpToMarkdown {

    private getSortedCommandList(obj : any) : string[] {
        const commands : string[] = [];
        
        for (const commandText in obj) {
            commands.push(commandText);
        }

        return commands.sort();
    }

    public getMarkdownFromHelp(help: any, commandPrefix?: string): string {
        const decorator = new MarkDownDecorator();
        let buf = "";

        const commands = this.getSortedCommandList(help);
        for (const commandIndex in commands) {
            const commandText = commands[commandIndex];
            const command = help[commandText];

            if (command["sub commands"]) {
                buf += this.getMarkdownFromHelp(command["sub commands"], commandText);
            } else {
                buf += this.getCommandMarkDown(command, decorator, commandPrefix);
            }
        }

        return buf;
    }

    private getCommandMarkDown(command: any, decorator: MarkDownDecorator, commandPrefix?: string): string {
        let buf = decorator.addH1(commandPrefix ? commandPrefix + " " + command.command : command.command);
        buf += decorator.addBold("Description :");
        buf += " " + command.description + "\n";
        buf += decorator.addNewLine();

        if (command.example && command.example !== "") {
            buf += (decorator.addBold("Example :") + "\n");
            buf += decorator.wrapCode(command.example);
            buf += decorator.addNewLine();
        }

        if (command.tokens && command.tokens.length > 0) {
            buf += (decorator.addBold("Tokens :") + "\n");
            buf += decorator.addTable(this.createTokenTable(command.tokens));
            buf += "\n";
            buf += decorator.addNewLine();
        }

        if (command.params && command.params.length > 0) {
            buf += (decorator.addBold("Parameters :") + "\n");
            buf += decorator.addTable(this.createParameterTable(command.params));
            buf += "\n";
            buf += decorator.addNewLine();
        }

        return buf;
    }

    private createTokenTable(tokens: CommandTokenHelp[]): MarkDownTable {
        const data = [];

        for (let i = 0; i < tokens.length; i++) {
            data.push([tokens[i].token + "", tokens[i].description, tokens[i].required ?? false]);
        }

        return {
            cols: [
                {
                    name: "Token", align: "c", width: 0
                },
                {
                    name: "Description", align: "r", width: 0
                },
                {
                    name: "Required", align: "c", width: 0
                }
            ],
            data: data
        };
    }

    private createParameterTable(parameters: CommandParameterHelp[]): MarkDownTable {
        const data = [];

        for (let i = 0; i < parameters.length; i++) {
            data.push([parameters[i].parameter + "", parameters[i].description, parameters[i].required ?? false]);
        }

        return {
            cols: [
                {
                    name: "Parameter", align: "r", width: 0
                },
                {
                    name: "Description", align: "r", width: 0
                },
                {
                    name: "Required", align: "c", width: 0
                }
            ],
            data: data
        };
    }
}
import { ParseTree } from "./parse-tree";

export class ParseState {
    QuoteCount: number;
    InSwitch: boolean;
    InSwitchVal: boolean;

    constructor() {
        this.QuoteCount = 0;
        this.InSwitch = false;
        this.InSwitchVal = false;
    }
}

export class CommandParser {
    private Delimiter = ' ';
    private Quote = '"';
    private SwitchDelimiter = '/';
    private EqualsToken = '=';


    private isNullOrEmpty(s: string): boolean {
        return s === undefined || s === null || s === "";
    }


    public parse(commandLine: string): ParseTree {
        const that = this;
        const parseTree = new ParseTree();
        const parseState = new ParseState();
        const tokens = [];
        let switchVal = "";
        let currentToken = "";

        parseTree.rawValue = commandLine;

        for (let i = 0; i < commandLine.length; i++) {
            const c = commandLine.charAt(i);

            if (this.isDelimiter(c) && parseState.QuoteCount == 0) {
                if (!this.isNullOrEmpty(currentToken) && currentToken != this.SwitchDelimiter)
                    tokens.push(currentToken);

                currentToken = c;
            }
            else if (c == this.Quote) {
                parseState.QuoteCount++;

                if (parseState.QuoteCount == 2) {
                    if (!this.isNullOrEmpty(currentToken) && currentToken != this.SwitchDelimiter)
                        tokens.push(currentToken);

                    currentToken = "";
                    parseState.QuoteCount = 0;
                }
            }
            else
                currentToken += c;
        }

        if (!this.isNullOrEmpty(currentToken))
            tokens.push(currentToken);

        tokens.forEach(function (token: string) {
            if (token.trim() == '')
                return;
            else if (token.startsWith(that.SwitchDelimiter) && !parseState.InSwitch) {
                parseState.InSwitch = true;
                switchVal = token;
            }
            else {
                if (parseState.InSwitch && token.startsWith('='))
                    parseTree.switches.add(switchVal.substr(1).trim(), token.substr(1).trim());
                else if (parseState.InSwitch) {
                    parseTree.switches.add(switchVal.substr(1).trim(), null);
                    parseTree.tokens.push(token.trim());
                } else
                    parseTree.tokens.push(token.trim());

                parseState.InSwitch = false;
            }
        });

        if (parseState.InSwitch) {
            parseTree.switches.add(switchVal.substr(1).trim(), null);
        }

        return parseTree;
    }


    private isDelimiter(c: any): boolean {
        return c == this.Delimiter || c == this.SwitchDelimiter || c == this.EqualsToken;
    }
}

import { KeyedCollection } from '../../../core/utility/dictionary';
import { IParseTree } from './parse-interfaces';

export class ParseTree implements IParseTree {


    public tokens: string[];
    public switches: KeyedCollection<string>;
    public rawValue: string;

    constructor();
    constructor(token?: string) {
        this.tokens = [];
        this.switches = new KeyedCollection<string>();

        if (token)
            this.tokens.push(token);
    }


    public getRequiredSwitch(key: string): string {
        if (!this.switches.containsKey(key))
            throw new Error(`key ${key} was not found`);

        return this.switches.item(key);
    }


    public switchExists(key: string): boolean {
        return this.switches.containsKey(key);
    }


    public tryGetSwitch(key: string, defaultValue?: string): string {
        try {
            return this.switches.item(key);
        }
        catch (error) {
            return defaultValue;
        }
    }
}

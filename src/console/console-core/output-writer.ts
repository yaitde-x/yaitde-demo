//import * as chalk from 'chalk';
//import chalk from 'chalk';
const chalk = require('chalk');

export interface ITheme {
    prompt: (str: string) => string;
    error: (str: string) => string;
    info: (str: string) => string;
    field: (str: string) => string;
    value: (str: string) => string;
}

export class DefaultTheme implements ITheme {
    prompt = (str: string)=> chalk.green(str);
    error = (str: string) => chalk.red(str);
    info = (str: string) => chalk.magenta(str);
    field = (str: string) => chalk.blue(str);
    value = (str: string) => chalk.cyan(str);
}

export class OutputWriter {

    private _theme: ITheme;

    constructor(theme: ITheme) {
        this._theme = theme ?? new DefaultTheme();
    }

    getPrompt(): string {
        return this._theme.prompt('anon:yac!> ');
    }

    info(msg: string): void {
        console.log(this._theme.info(msg));
    }

    error(msg: string): void {
        console.log(this._theme.error(msg));
    }
}

const chalk = require('chalk');

export interface ILogger {
    log(obj: any): void;
    info(obj: any): void;
    warn(obj: any): void;
    error(obj: any): void;
}

export class ConsoleLogger implements ILogger {
    
    private getLogEntry(obj: any) : any {
        if (typeof obj === 'object' && obj !== null)
            return JSON.stringify(obj);
        return obj;
    }

    log(obj: any): void {
        console.log(this.getLogEntry(obj));
    }

    info(obj: any): void {
        console.info(chalk.cyan(this.getLogEntry(obj)));
    }

    warn(obj: any): void {
        console.warn(chalk.yellow(this.getLogEntry(obj)));
    }

    error(obj: any): void {
        console.error(chalk.red(this.getLogEntry(obj)));
    }

}
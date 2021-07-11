import * as chalk from 'chalk';
import { TestLogEntry, ITimeProvider } from './models';

export interface ILogger {
    getLogEntries(): TestLogEntry[];
    logEntry(obj: TestLogEntry): void;
    log(obj: any): void;
    info(obj: any): void;
    warn(obj: any): void;
    error(obj: any): void;
}

export class TestLogger implements ILogger {

    _logEntries: TestLogEntry[] = [];
    _timeProvider: ITimeProvider;

    constructor(timeProvider: ITimeProvider) {
        this._logEntries = [];
        this._timeProvider = timeProvider;
    }

    private createEntry(type: string, message: string, data: any): TestLogEntry {
        return {
            entryDate: this._timeProvider.getUtcDate(),
            type: type,
            message: message,
            data: data
        };
    }
    getLogEntries(): TestLogEntry[] {
        return this._logEntries;
    }

    logEntry(obj: TestLogEntry): void {
        obj.entryDate = this._timeProvider.getUtcDate();
        this._logEntries.push(obj);
    }

    log(obj: any): void {
        this._logEntries.push(this.createEntry("always", "", obj));
    }

    info(obj: any): void {
        this._logEntries.push(this.createEntry("info", "", obj));
    }

    warn(obj: any): void {
        this._logEntries.push(this.createEntry("warn", "", obj));
    }

    error(obj: any): void {
        this._logEntries.push(this.createEntry("error", "", obj));
    }
}

export class ConsoleLogger implements ILogger {

    getLogEntries(): TestLogEntry[] {
        return [];
    }

    logEntry(obj: TestLogEntry): void {
        console.log(obj);
    }

    log(obj: any): void {
        console.log(obj);
    }

    info(obj: any): void {
        console.info(chalk.cyan(obj));
    }

    warn(obj: any): void {
        console.warn(chalk.yellow(obj));
    }

    error(obj: any): void {
        console.error(chalk.red(obj));
    }

}
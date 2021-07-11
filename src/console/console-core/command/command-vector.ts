import { KeyedCollection } from '../../../core/utility/dictionary';
import { ICommandVector, CommandSwitch, NullCommand, CommandHandler, CommandHelp } from './parse-interfaces';

export class CommandVector implements ICommandVector {


    public constructor();
    public constructor(command?: string, vector?: CommandHandler) {
        this.childCommands = new KeyedCollection<ICommandVector>();
        this.command = command;
        this.vector = vector ?? NullCommand;
    }

    public command: string;
    public isSystemCommand: string;
    public help?: CommandHelp;
    public Switches: CommandSwitch[];
    public vector: CommandHandler;
    public childCommands: KeyedCollection<ICommandVector>;

    public addChildCommand(vector: ICommandVector): void {
        this.childCommands.add(vector.command, vector);
    }
}

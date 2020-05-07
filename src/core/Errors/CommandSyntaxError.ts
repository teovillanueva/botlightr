import { Command, Bot } from "../";

export class CommandSyntaxError {
    public name = "CommandSyntaxError";
    public usage: string;

    constructor(
        private readonly bot: Bot,
        private readonly command: Command<any, any>
    ) {
        this.usage = `${this.bot.prefix}${this.command.name}${this.command.args.reduce((usage, arg) => `${usage} <${arg}>`, "")}`;
    }
}

import { Message, User, Client, Channel, TextChannel, DMChannel, NewsChannel } from "discord.js";

import { CommandSyntaxError } from "./Errors/CommandSyntaxError";

import { Bot } from "./Bot";

type CommandHandler<Args> = (context: IContext<Args>) => void;

type CommandErrorHandler<Args> = (context: IContext<Args>) => void;

interface ICommandConfig<T, U> {
    name: string;
    alias?: string;
    args: T[];
    handler: CommandHandler<U>;
    description?: string;
    textArgIndex?: number;
    onError?: CommandErrorHandler<U>;
}

interface IContext<U> {
    message: Message;
    author: Message["author"];
    reply: Message["reply"];
    send: Message["channel"]["send"];
    mentioned: { [key: string]: User };
    args: U;
    bot: Bot;
    client: Client;
    channel: TextChannel | DMChannel | NewsChannel;
    error?: Error;
    command: Command<any,any>;
}

export class Command<T extends string, U = { [K in T]: string }> {

    public name: string;
    public alias?: string;
    public args: T[];
    public description?: string;
    public handler: CommandHandler<any>;
    public onError?: CommandErrorHandler<any>;
    public textArgIndex?: number;

    constructor(config: ICommandConfig<T, U>) {
        this.name = config.name;
        this.alias = config.alias;
        this.args = config.args;
        this.description = config.description;
        this.handler = config.handler;
        this.onError = config.onError;
        this.textArgIndex = config.textArgIndex;
    }

    private castArgsToObject(args: string[], bot: Bot) {
        let casted: { [key: string]: string } = {};
        for (let i = 0; i < this.args.length; i++) {
            const arg = this.args[i];
            if (this?.textArgIndex === i && args[this.textArgIndex]) {
                casted[arg] = args.filter((arg, argIndex) => argIndex >= i).join(" ");
            } else if (args[i]) {
                casted[arg] = args[i];
            }
        }

        return casted;
    }

    public callHandler(bot: Bot, message: Message, args: string[]) {
        const context = this.getContext(bot, message, args);

        this.handler(context);
    }

    public handleError(bot: Bot, error: Error, message: Message, args: string[]) {
        if (this.onError) {
            const context = this.getContext(bot, message, args, error);
            this.onError(context)
        }
    }

    /**
     * 
     * @description Returns a new instance of command. Same as calling with new.
     */
    public static factory<T extends string, U = { [K in T]: string }>(config: ICommandConfig<T, U>) {
        return new this(config)
    }

    /**
     * @description Returns command handler context 
     */
    private getContext(bot: Bot, message: Message, args: string[], error?: Error): IContext<U> {
        const formatedArgs = this.castArgsToObject(args, bot);

        if (!error) {
            if (Object.keys(formatedArgs).length !== this.args.length || (!this.textArgIndex && args.length > this.args.length)) {
                throw new CommandSyntaxError(bot, this)
            }
        }

        const context: IContext<U> = {
            bot,
            client: bot.client,
            channel: message.channel,
            args: formatedArgs as unknown as U,
            author: message.author,
            error: error,
            message: message,
            reply: message.reply,
            send: message.channel.send,
            command: this,
            mentioned: {}
        }

        for (const key in formatedArgs) {
            if (formatedArgs.hasOwnProperty(key)) {
                const arg = formatedArgs[key];
                if (arg.startsWith("<@!") && arg.endsWith(">")) {
                    const id = arg.substring(3).slice(0, -1);
                    const user = message.mentions.users.get(id);
                    if (user) {
                        context.mentioned[arg] = user;
                    }
                }
            }
        }

        return context;
    }

    get argsUsage() {
        return this.args.reduce((usage, arg) => `${usage} <${arg}>`, "")
    };

}

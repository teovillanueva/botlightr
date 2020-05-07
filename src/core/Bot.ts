import { Client } from "discord.js";

import { Command } from "./Command";

declare var COMMANDS_PATH: string;

export interface IBotConfig {
    token?: string;
    prefix: string;
}

export class Bot {

    public readonly client: Client;

    private config!: IBotConfig;

    public commands: Command<any, any>[] = [];

    constructor(config: IBotConfig, client?: Client) {
        this.config = config;
        if (client) {
            this.client = client;
        } else {
            this.client = new Client();
        }
    }

    /**
     * @description Registers a single command
     */
    public registerCommand(command: Command<any, any>) {
        this.commands.push(command);
        return this;
    }

    /**
     * @description Registers multiple commands
     */
    public registerCommands(commands?: Command<any, any>[]) {

        // if (!commands) {
        //     const requireCommand = require.context(COMMANDS_PATH, true, /\.ts$/);

        //     const commands = requireCommand.keys().map(key => {
        //         if (key.endsWith(".ts")) {
        //             return requireCommand(key).default;
        //         }
        //     }) as Command<any, any>[];

        //     this.commands = [...this.commands, ...commands];
        // }

        if (Array.isArray(commands)) {
            commands.forEach(command => {
                const exists = this.commands.filter(cmd => cmd === command || cmd.name === command.name)[0];

                if (exists || !(command instanceof Command)) {
                    throw new Error("Invalid command");
                }
            })

            this.commands = [...this.commands, ...commands];
        }

        return this;
    }

    public login(token?: string) {
        if (token) {
            this.config.token = token;
        } else if (!this.config.token) {
            throw new Error("Please setup your bot key.");
        }

        this.client.login(this.config.token);

        this.registerCommandHandlers();

        return this;
    }

    private registerCommandHandlers() {
        this.client.on("message", (message) => {

            if (!message.guild) return;
            if (message.author.bot) return;

            if (message.content.startsWith(this.config.prefix)) {
                const args = message.content.split(" ");

                const name = args.shift()?.substring(this.config.prefix.length);

                this.commands.map(command => {
                    if (command.name === name || name === command.alias) {
                        try {
                            command.callHandler(this, message, args);
                        } catch (error) {
                            command.handleError(this, error, message, args);
                        }
                    }
                })
            }
        });
    }

    get prefix() {
        return this.config.prefix;
    }

}
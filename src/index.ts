import { Client } from "discord.js";

import { Bot, Command } from "./core";

const myClient = new Client();

const myBot = new Bot({ prefix: "!" }, myClient); // You have to pass the client as the second argument

export const PingPongCommand = new Command({
    name: "ping",
    args: [],
    async handler({ reply }) {
        await reply("pong!");
    },
});

export const SumCommand = new Command({
    name: "sum",
    alias: "s",
    description: "Sums up two numbers",
    args: ["n1", "n2"],
    async handler({ args, send, reply }) {
        const result = parseInt(args.n1) + parseInt(args.n2);

        if (isNaN(result)) {
            return await reply("Make shure both numbers are valid!");
        }

        await send(`${args.n1} + ${args.n2} = ${result}`);
    }
})

myClient.login("<your_token_here>")

export * from "./core"
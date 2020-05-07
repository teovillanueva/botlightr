# Botlightr

Botlightr is a TypeScript / JavaScript library for dealing with [discord.js](https://github.com/discordjs/discord.js) commands.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install Botlightr.
```bash
npm install botlightr
```

## Setup

Letting Botlightr manage the discord.js Client

```typescript
import { Bot } from "botlightr";

const myBot = new Bot({ prefix: "!", token: "<your_bot_token_here>" }) // token is optional, you can still pass it in the login method

myBot.login("<your_bot_token_here>") // The token argument is optional since you can set it on the bot first constructor agument
```

Passing your own discord.js Client

```typescript
import { Client } from "discord.js";

import { Bot } from "botlightr";

const myClient = new Client();

const myBot = new Bot({ prefix: "!" }, myClient); // You have to pass the client as the second argument

myClient.login("<your_bot_token_here>")
```

## Defining commands

Creating a simple ping-pong command

```typescript
import { Command } from "botlightr";

export const PingPongCommand = new Command({
    name: "ping",
    args: [],
    async handler({ message }) {
        await message.reply("pong!");
    },
});

```

Creating a little bit more complex command

```typescript
import { Command } from "botlightr";

export const SumCommand = new Command({
    name: "sum",
    alias: "s",
    description: "Sums up two numbers",
    args: ["n1", "n2"],
    async handler({ args, message, channel }) {
        const result = parseInt(args.n1) + parseInt(args.n2);

        if (isNaN(result)) {
            return await message.reply("Make shure both numbers are valid!");
        }

        await channel.send(`${args.n1} + ${args.n2} = ${result}`);
    }
});
```

## Error handling
We'll use the sum command from above for the following example. When an error is thrown in the command handler the onError method from the command config will catch it and handle it. Botlightr provides a custom error for handling command syntax errors.

```typescript
import { Command, CommandSyntaxError } from "botlightr";

export const SumCommand = new Command({
    ...,
    async onError({ error, message }) {
        if (error instanceof CommandSyntaxError) {
            return message.reply(`Please use the command like this ${error.usage}`);
        };
    },
});
```

## Command arguments

Botlightr comes with full native support for typescript. It gives you full intellisense over your code! You can still use botlightr in plain javascript.

```typescript
export const SayCommand = new Command({
    name: "say",
    args: ["word"], // Unique arg
    async handler({ args }) {
        args.word // Valid
        args.duck // Property 'duck' does not exist on type '{ word: string; }'
    },
});
```

## Register commands

For registering a single command use the following bot instance method

```typescript
import { PingPongCommand } from "./commands";

myBot.registerCommand(PingPongCommand);
```

If you want to register multpile commands at once you can use the following bot instance method

```typescript
// You can find the HelpCommand in the examples folder

myBot.registerCommands([PingPongCommand, HelpCommand]);
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

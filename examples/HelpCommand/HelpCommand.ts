/*
    import { Command, CommandSyntaxError } from "botlightr";
*/
import { Command, CommandSyntaxError } from "../../src/";

/*
    You can also create a new command by calling `Command.factory`
*/
const HelpCommand = new Command({
    name: "help",
    alias: "h",
    description: "Displays all the commands available",
    args: [],
    async handler({ bot, channel }) {
        bot.commands.forEach(command => {
            channel.send(`**${bot.prefix}${command.name}** *${command.description}*, usage: \`${bot.prefix}${command.name}${command.argsUsage}\``)
        })
    },
    async onError({ error, author }) {
        if (error instanceof CommandSyntaxError) {
            author.send(`You are using the command wrong, the usage is like this: ${error.usage}`)
        }
    }
});
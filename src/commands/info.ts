import { Message } from "discord.js";
import { myClient } from "src/main";

exports.run = async (client: myClient, message: Message, args: string[]) => {
    message.reply(`discord test bot made by <@521819891141967883>\n try \`${client.config.prefix}bj\` for blackjack *wip*`)
}

exports.name = "info";
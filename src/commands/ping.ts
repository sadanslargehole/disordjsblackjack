import { Message } from "discord.js";
import { myClient } from "src/main";

exports.run = async (client: myClient, message: Message, args: string[]) => {
    message.reply(`pinged in ${(new Date().getMilliseconds()) -message.createdTimestamp}`)
}

exports.name = "ping";
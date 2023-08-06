import { Message } from "discord.js";
import { exit } from "process";
import { myClient } from "src/main";

exports.run = async (client: myClient, message: Message, args: string[]) => {
    if (!(message.author.id===client.config.ownerId)) return;
    exit(0);
}

exports.name = "quit";
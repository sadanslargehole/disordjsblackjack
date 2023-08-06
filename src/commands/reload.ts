import { trace } from "console";
import { Collection, Message } from "discord.js";
import { readdirSync } from "fs";
import { myClient } from "src/main";

exports.run = async (client: myClient, message: Message, args: string[]) => {
    //FIXME: fix at some point
    if (message.author.id != client.config.ownerId) return
    const commands: string[] = readdirSync("src/commands").filter((f) =>
        f.endsWith(".ts")
    );
    for (const commandfile in commands) {
        console.log(`${commands[commandfile]} loading`);
        const commandName = commands[commandfile].split(".")[0];
        // not fixing rn
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const command = require(`./${commands[commandfile]}`);
        try {

            client.commands.set(commandName, command);
        } catch (error) {
            console.log(`${commands[commandfile]} didnt load`);
            trace(error);
        } finally {
            console.log(`${commands[commandfile]} loaded`);
        }
    }
}

exports.name = "reload";
exports.info = "realod commands and events";
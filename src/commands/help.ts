import { Message } from "discord.js";
import { myClient } from "src/main";

exports.run = async (client: myClient, message: Message, args: string[]) => {
    let thingtosend: string;
    client.commands.forEach((c)=>{
        thingtosend = thingtosend + c;
    })
    message.reply(thingtosend!);
}
exports.name = "help";
import { Message } from 'discord.js';
import { myClient } from 'src/main';

module.exports = (client: myClient , message: Message): void=>{
    console.log('message recived');
    if (message.author.bot){return;}
    const botid = client.user?.id || '';
    if (message.mentions.has(botid)){
        message.channel.send(`<@${message.author.id}>`);
        return;
    }
    if (message.content.startsWith(client.config.prefix)){
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
        if(!args[0]){
            return;
        }
        const command = args.shift()?.toLowerCase() || '';
        const cmd  = client.commands.get(command);
        if (!cmd) return;

        cmd.run(client, message, args);
    }

};
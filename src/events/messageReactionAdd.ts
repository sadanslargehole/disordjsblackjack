import { MessageReaction, PartialMessageReaction, PartialUser, User } from 'discord.js';
import { myClient } from 'src/main';
import { deal, player_hit, value } from '../util/blackjacks';
import { trace } from 'console';

module.exports = async (client: myClient, reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser ): Promise<void>=>{
    let authorid = user.id;
    async function bj(){
        try{
        if (user.bot) return   
        console.log(client.blackjack.active_game_bot.get(authorid)!.id);
        console.log(reaction.message.id);
        
        if (client.blackjack.active_game_bot.get(authorid)!.id != reaction.message.id) return
        if (reaction.emoji.name == ('🃏'|| '🖐️')) {
            console.log('asd');
            reaction.remove()
            if (reaction.emoji.name == '🃏'){
                //hit
                let hit = player_hit(deal(client.blackjack.decks.get(authorid)!), client.blackjack.hands.get(authorid)!);
                if (value(hit) == 21){
                    //player got lucky. Yipiee!
                    
                }
            }
        }} catch(e){
            trace(e)
        }

        
        
    }
    await bj()
};
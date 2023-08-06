import { APIEmbed, EmbedBuilder } from 'discord.js';
import { card, numbers, suits } from './blackjackConfig';
export function new_deck(): card[] {
    let deck= new Array<card>();
    for (let i = 0; i < 4; i++) {
        for (const suit of suits) {
            for (const num of numbers) {
                // why is this a string?
                //the world may never know
                deck!.push(
                    new card(suit, num, false, num.toString())
                );
            }
            deck!.push(new card(suit, 11, true, 'A'));
            deck!.push(new card(suit, 10, true, 'J'));
            deck!.push(new card(suit, 10, true, 'Q'));
            deck!.push(new card(suit, 10, true, 'K'));
        }
    }
    return deck!;
}
export function deal(deck: card[]): card {
    return <card>deck.splice(Math.floor(Math.random() * deck.length), 1).pop();
}
export function player_hit(thecard: card, player_hand: card[]): card[] {
    /** player hit logic
     * card renamed to thecard because of `new card(...)`
     */
    let player_hand_value = value(player_hand);
    if (thecard.ace && thecard.value + player_hand_value > 21) {
        player_hand.push(new card(thecard.suit, 1, true, 'A'));
    } else {
        player_hand.push(thecard);
    }
    player_hand_value = value(player_hand);
    return player_hand;
}
export function dealer_play(thecard: card, dealerHand: card[]): card[] {
    if (thecard.ace && thecard.value + value(dealerHand) > 21) {
        dealerHand.push(new card(thecard.suit, 1, true, 'A'));
    } else {
        dealerHand.push(thecard);
    }
    value(dealerHand);
    return dealerHand;
}
export function value(hand: card[]): number {
    let aces = new Array<card>();
    let total = 0;
    for (const card of hand) {
        console.log(card.hidden);
        if (card.hidden == true){
            continue
        }
        if (card.ace) {
            aces.push(card);
            continue;
        }
        total += card.value;
    }
    if (aces.length>=1){
        if(aces.length===1){
            if (total+11>21){
                aces[0].value =1;
                return total + 1;
            }
            if (total+11<=21){
                return total + 11;
            }
        }
        if (aces.length>=2){
            const a = aces[0].value + aces.length-1+ total;
            if (a<=21){
                aces.shift();
                for (let i =0; i<aces.length;i++ ){
                    aces[i].value = 1;
                }
                if (total){ // check if we only have aces
                    return 11 + aces.length + total;
                }
                return 11+ aces.length;
            }
            if (a>21){
                if (aces.length+ total>21){
                    for(let i = 0; i<aces.length; ++i){
                        aces[i].value = 1;
                    }
                    return total+ aces.length;

                }
                return a;
            }
        }
    }
    return total;
}
// db functions are in the client.db object
export function value_with_hidden(hand: card[]): number {
    let aces= new Array<card>();
    let total = 0;
    //TODO: why are java for loops always strings
    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        if (card.ace) {
            aces.push(card);
            continue;
        }
        total += card.value;
    }
    if (aces!){
        if(aces.length===1){
            if (total+11>21){
                aces[0].value =1;
                return total + 1;
            }
            if (total+11<=21){
                return total + 11;
            }
        }
        if (aces.length>=2){
            const a = aces[0].value + aces.length-1+ total;
            if (a<=21){
                aces.shift();
                for (let i =0; i<aces.length;i++ ){
                    aces[i].value = 1;
                }
                if (total){ // check if we only have aces
                    return 11 + aces.length + total;
                }
                return 11+ aces.length;
            }
            if (a>21){
                if (aces.length+ total>21){
                    for(let i = 0; i<aces.length; ++i){
                        aces[i].value = 1;
                    }
                    return total+ aces.length;

                }
                return a;
            }
        }
    }
    return total;
}
//Whoops! forgot to write dealer_finish()
/**
 * 
 * @param dealer_hand 
 * @param deck 
 * @returns TODO: finish this doc later
 */
export function dealer_finish(dealer_hand: card[], deck: card[]): card[]{
    let whoops = 0;
    while(value(dealer_hand)<17&&whoops<10){
        dealer_hand = dealer_play(deal(deck) ,dealer_hand);
        whoops++;
    }
    return dealer_hand;
}
export function namethislater(hand: card[]): string{
    let temp = new Array<string>();
    hand.forEach((card)=>{
        temp.push(card.name);
    });
    return temp!.join(' | ');
}
export function unhideHand(hand: card[]): void{
    hand.forEach((card)=>{
        card.hidden = false;
        card.name = `${new String(card.symbol)} ${card.suit}`
    })
}
/**
 * 
 * @param player_hand players hand  
 * @param dealer_hand dealers hand
 * @param state -1 for loss; 0 for push; 1 for win; 4 if the game is still going
 * @returns the built embed already in JSON
 */
export function createembed(player_hand: card[], dealer_hand: card[], state: number): APIEmbed{
    console.log(dealer_hand[1].hidden);
    
    let title: string;
    let color: number;
    let blackjack: string;
    if (state !=4) unhideHand(dealer_hand);
    console.log(dealer_hand[1].hidden);
    let description = `Player's hand: ${namethislater(player_hand)} (total ${value(player_hand)})\nDealer's hand: ${namethislater(dealer_hand)} (total ${value(dealer_hand)})`
    switch (state) {
        case -1:
            title = 'You lose'
            color = 15548997
            break;
        case 0:
            title  = 'Push!'
            color = 10070709
            break;
        case 1:
            title = 'You win!'
            color = 5763719
            break;
        case 4:
            title = 'Blackjack!'
            color = 10070709;
            description = `Player's hand: ${namethislater(player_hand)} (total ${value(player_hand)})\nDealer's hand: ${namethislater(dealer_hand)} (total ${value_with_hidden(dealer_hand)})`
            blackjack = '🃏 HIT | 🖐️ STAND'
            break;
        default:
            throw new Error('oops error in createembed at src/util/blackjack.ts ')
    }
    
    return new EmbedBuilder({
        title: title!,
        color: color!,
        description: description,
        footer:{
            text: blackjack! || 'Thanks For Playing.'
        }
    }).toJSON()
}
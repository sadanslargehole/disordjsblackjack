/* this file name isnt remotely right */
import { Message } from 'discord.js';

export class bjcfg{
    active_game: Map<string, Message>;
    active_game_bot!: Map<string, Message>;
    hands:Map< string, card[]>;
    dealer_hands: Map<string, card[]>;
    bets: Map<string, number>;
    decks: Map<string, card[]>;
    constructor() {
        this.decks = new Map<string, card[]>;
        this.bets = new Map<string, number>;
        this.dealer_hands = new Map<string,card[]>;
        this.hands = new Map<string, card[]>;
        this.active_game_bot = new Map<string, Message>;
        this.active_game = new Map<string, Message>;
    }

} 
export const suits = ['<:spades:936447656463597568>', '<:hearts:936447656480350249>',
    '<:diamonds:936447656589398066>', '<:clubs:936447656199348256>'];
export const numbers: number[] = [1,2,3,4,5,6,7,8,9,10];
export class card{
    suit: string;
    value: number;
    ace: boolean;
    symbol: string;
    name: string;
    hidden: boolean;
    
    constructor(suit: string, value: number, ace: boolean = false, symbol: string | null=null, hidden: boolean = false) {
        this.suit = suit;
        this.value = value;
        this.ace = ace;
        this.symbol = symbol || String(value);
        this.name = `${this.symbol} ${this.suit}`;
        this.hidden = hidden;
        if (this.hidden) this.name = '?? of ?';
    }
}
import { trace } from "console";
import { Message } from "discord.js";
import { myClient } from "../main";
import {
	deal,
	dealer_finish,
	new_deck,
	value,
	value_with_hidden,
	createembed,
} from "../util/blackjacks";

exports.run = async (client: myClient, message: Message, args: string[]) => {
	//TODO: before any return statement updeate the client.blackjack.decks.set(**set deck here**)
	//TODO: reassign deck at the end
	try {
		const authorid = message.author.id;
		if (args.length > 1) {
			throw new Error("too many args");
		}
		const bal = client.db.get(message.author.id);
		const wager = Math.floor(parseInt(args[0]));
		if (wager > bal) {
			throw new Error("your broke");
		}
		if (wager > 7500) {
			throw new Error("your wager is too much");
		}
		if (wager < 15) {
			throw new Error("wager is too little");
		}
		if (client.blackjack.active_game.get(message.author.id) !== undefined) {
			throw new Error(
				"You already have a game in progress. Finish that first.\n" +
					`you can also use ${client.config.prefix}bjq to end your active game`
			);
		}
		client.db.take(authorid, wager);
		const deck = new_deck();

		client.blackjack.active_game.set(authorid, message);
		client.blackjack.dealer_hands.set(authorid, [deal(deck), deal(deck)]);
		client.blackjack.hands.set(authorid, [deal(deck), deal(deck)]);
		client.blackjack.dealer_hands.get(authorid)![1].hidden = true;
		client.blackjack.dealer_hands.get(authorid)![1].name = "?? of ?";
		client.blackjack.bets.set(authorid, wager);
		const init_dealer_value = value_with_hidden(
			client.blackjack.dealer_hands.get(authorid)!
		);
		const init_player_value = value(client.blackjack.hands.get(authorid)!);
		if (init_player_value == 21) {
			dealer_finish(client.blackjack.dealer_hands.get(authorid)!, deck);

			let hand_tmp = client.blackjack.hands.get(authorid)!;
			let d_hand_tmp = client.blackjack.dealer_hands.get(authorid)!;
			if (value(d_hand_tmp) == 21) {
				message.reply({
					embeds: [createembed(hand_tmp, d_hand_tmp, 0)],
				});
				return;
			}
			client.db.add(authorid, Math.ceil(wager * 2.5));
			message.reply({
				embeds: [createembed(hand_tmp, d_hand_tmp, 1)],
			});
			return;
		}
		if (init_dealer_value == 21) {
			message.reply({
				embeds: [
					createembed(
						client.blackjack.hands.get(authorid)!,
						client.blackjack.dealer_hands.get(authorid)!,
						-1
					),
				],
			});
			//TODO: end game
			return;
		}
		let m = await message.reply({
			embeds: [
				createembed(
					client.blackjack.hands.get(authorid)!,
					client.blackjack.dealer_hands.get(authorid)!,
					4
				),
			],
		});
		m.react("🃏");
		m.react("🖐️");
		client.blackjack.active_game_bot.set(authorid, m);
		client.blackjack.decks.set(authorid, deck);
	} catch (error) {
		trace(error);
	}
};

exports.name = "bj";

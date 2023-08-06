import { trace } from "console";
import {
    Client,
    ClientOptions,
    Collection,
    GatewayIntentBits,
} from "discord.js";
import { readdirSync } from "fs";
import { bjcfg } from "./util/blackjackConfig";
import { database } from "./util/db";
console.log("no crash yet");
export interface cftest {
    token: string;
    prefix: string;
    ownerId: string;
}
export class myClient extends Client {
    //FIXME: see below, dont know how to fix it now
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commands: Collection<
        string,
        /* this any is for the command code itself from the require(`commandfile`); i dont know the type for it */ any
    >;
    config: cftest;
    blackjack!: bjcfg;
    db: database;
    constructor(options: ClientOptions) {
        super(options);
        this.config = require("./config.json");
        this.commands = new Collection();
        this.db = new database(4000);
        this.blackjack = new bjcfg();
    }
}
const client = new myClient({
    intents: [
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
    ],
});
function loadEvents(): void {
    const events: string[] = readdirSync("src/events").filter((f) =>
        f.endsWith(".ts")
    );
    console.log(events);

    for (const file in events) {
        console.log(`loading ${events[file]}`);

        const eventName: string = events[file].split(".")[0];
        // not fixing rn
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const event = require(`./events/${events[file]}`);
        try {
            client.on(eventName, event.bind(null, client));
        } catch (e) {
            trace(e);
            console.log(`error loading ${file}`);
        } finally {
            console.log(`loaded ${file}`);
        }
    }
}
loadEvents();
function loadCommands(): void {
    const commands: string[] = readdirSync("src/commands").filter((f) =>
        f.endsWith(".ts")
    );
    for (const commandfile in commands) {
        console.log(`${commands[commandfile]} loading`);
        const commandName = commands[commandfile].split(".")[0];
        // not fixing rn
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const command = require(`./commands/${commands[commandfile]}`);
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
loadCommands();
client.login(client.config.token);

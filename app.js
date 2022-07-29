import "./slashBuilder.js";
import "dotenv/config";
import { interactionFilter } from "./interactions/interactionsFilter.js";
import Discord from "discord.js";
import { messageFilter } from "./messages/messageFilter.js";
const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
	],
	partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.on("ready", () => {
	console.log(`${client.user.tag} is Online!`);
});

//Reaction Controler for join messages.
client.on("messageCreate", (message) => {
	if (message.type === "GUILD_MEMBER_JOIN") {
		messageFilter("joinMessageReaction", message);
	}
});

client.on("messageReactionAdd", async (reaction, user) => {
	messageFilter("messageReactionAdd", reaction.message, reaction, user);
});

client.on("messageReactionRemove", async (reaction, user) => {
	messageFilter("messageReactionRemove", reaction.message, reaction, user);
});

client.on("interactionCreate", (interaction) => {
	interactionFilter(interaction, "CREATE");
});

let botOnInt;

function setInt() {
	botOn();
	botOnInt = setInterval(botOn, 60000);
	client.once("ready", () => {
		clearInterval(botOnInt);
	});
}
function botOn() {
	try {
		client.login(process.env.botToken);
	} catch {
		console.log("There was an error logging in. Check your internet connection.");
	}
}
setInt();

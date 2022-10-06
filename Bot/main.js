import "../Utilities/slashBuilder.js";
import "dotenv/config";
import "../API/main.js";
import { interactionFilter } from "./interactions/interactionsFilter.js";
import Discord from "discord.js";
import { messageFilter } from "./messages/messageFilter.js";
import { db } from "../Utilities/database.js";
import { errorHandler, messageLogger } from "../Utilities/logging.js";
const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
	],
	partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

// const intentsBitField = new Discord.intentsBitField();
// intentsBitField.add(Discord.intentsBitField)

client.on("ready", () => {
	console.log(`${client.user.tag} is Online!`);
});

client.on("guildCreate", async (guild) =>{
	if(await checkGuild(guild)){
		addGuild(guild)
	}
})

//Reaction Controler for join messages.
client.on("messageCreate", (message) => {
	// console.log(message)
	if (message.type === "GUILD_MEMBER_JOIN") {
		messageLogger(message.type,message.author.username,message.content);
		messageFilter("joinMessageReaction", message);
	}else if(message.type === "USER_PREMIUM_GUILD_SUBSCRIPTION"){
		messageLogger(message.type,message.author.username,message.content);
		messageFilter("boostMessageReaction", message);
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

async function checkGuild(guild){
	return db.promise().execute(`SELECT guildId FROM guilds WHERE guildId = ?`, [guild.id])
	.then(({res}) => {
		console.log(res)
		if(res.lenght > 0){
			return false;
		}else{
			return true;
		}
	})
	.catch((err) => {
		errorHandler(err);
	})
}

async function addGuild(guild){
	return db.promise().execute(`INSERT INTO guilds (guildId, ownerId, name) VALUES (?,?,?)`, [guild.id,guild.ownerId,guild.name])
	.then(({res})=> {
		if(res.lenght > 0){
			return "completed";
		}else{
			return "error";
		}
	})
	.catch((err) => {
		errorHandler(err);
	})
}

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

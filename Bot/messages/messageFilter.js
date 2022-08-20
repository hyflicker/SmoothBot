import { messageReaction } from "./options/messageReactions.js";

export function messageFilter(type = String, message, reaction, user) {
	switch (type) {
		case "joinMessageReaction":
			if (message.guildId === "839568492113297498") {
				let emoji = message.guild.emojis.cache
					.filter((emote) => emote.name === "doctorrSup")
					.map((emote) => emote)[0];
				message.react(`${emoji.id}`).catch((err) => {
					console.error(err);
				});
			}
			break;
		case "messageReactionAdd":
			messageReaction(reaction, user, "ADD");
			break;
		case "messageReactionRemove":
			messageReaction(reaction, user, "REMOVE");
			break;
		default:
			break;
	}
}

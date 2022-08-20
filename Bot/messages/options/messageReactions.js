import { db } from "../../../Utilities/database.js";
import { errorHandler } from "../../../Utilities/errorLogging.js";
export async function messageReaction(reaction, user, type = String) {
	await reaction.fetch();
	switch (type) {
		case "ADD":
			db
				.promise()
				.execute(
					`SELECT * FROM reactionroles WHERE reactionName = ? AND messageId = ? AND channelId = ? AND ?`,
					[
						reaction.emoji.name,
						reaction.message.id,
						reaction.message.channelId,
						reaction.message.guildId,
					],
				)
				.then(([results]) => {
					if (results.length > 0) {
						let roleName = reaction.message.guild.roles.cache
							.filter((role) => role.id === `${results[0].roleId}`)
							.map((role) => role.name)[0];
						reaction.message.guild.members.cache
							.get(user.id)
							.roles.add(`${results[0].roleId}`);
						console.log(
							`${user.username} reactionAdd with ${reaction.emoji.name} to get ${roleName} role`,
						);
					}
				})
				.catch((err) => {
					errorHandler(err);
					return;
				});
			break;
		case "REMOVE":
			db
				.promise()
				.execute(
					`SELECT * FROM reactionroles WHERE reactionName = ? AND messageId = ? AND channelId = ? AND ?`,
					[
						reaction.emoji.name,
						reaction.message.id,
						reaction.message.channelId,
						reaction.message.guildId,
					],
				)
				.then(([results]) => {
					if (results.length > 0) {
						let roleName = reaction.message.guild.roles.cache
							.filter((role) => role.id === `${results[0].roleId}`)
							.map((role) => role.name)[0];
						reaction.message.guild.members.cache
							.get(user.id)
							.roles.remove(`${results[0].roleId}`);
						console.log(
							`${user.username} reactionRemove with ${reaction.emoji.name} to get rid of the ${roleName} role`,
						);
					}
				})
				.catch((err) => {
					errorHandler(err);
				});

			break;

		default:
			break;
	}
}

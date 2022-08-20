import { db } from "../../../Utilities/database.js";
import { errorHandler } from "../../../Utilities/errorLogging.js";
function code(interaction) {
	db
		.promise()
		.execute(
			`SELECT * FROM commandresponses WHERE commandName = ? AND guildId = ?`,
			[interaction.commandName, interaction.guildId],
		)
		.then(async ([res]) => {
			if (res.length > 0) {
				await interaction.reply({
					content: `The code is ${res[0].commandResponse}`,
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					content: `Error! Please try again later or have a mod to create a code.`,
				});
			}
		})
		.catch((err) => {
			errorHandler(err);
			return;
		});
}
function codeChange(interaction) {
	let newCode = interaction.options["_hoistedOptions"][0].value;
	db
		.promise()
		.execute(
			`UPDATE commandresponses SET commandResponse = ? WHERE commandName = 'code' AND guildId = ?`,
			[newCode, interaction.guildId],
		)
		.then(async ([res]) => {
			if (res.affectedRows > 0) {
				await interaction.reply({
					content: `Code is now updated to ${newCode}`,
					ephemeral: true,
				});
			} else {
				db
					.promise()
					.execute(
						`INSERT INTO commandresponses (commandName,commandResponse,guildId) VALUES (?,?,?)`,
						["code", newCode, interaction.guildId],
					)
					.then(async (results) => {
						if (results.affectedRows > 0) {
							await interaction.reply({
								content: `Code is now updated to ${newCode}`,
								ephemeral: true,
							});
						} else {
							await interaction.reply({ content: `Error! Please try again later.` });
						}
					})
					.catch((err) => {
						errorHandler(err.sqlMessage);
						return;
					});
			}
		})
		.catch((err) => {
			errorHandler(err.sqlMessage);
			return;
		});
}

export default { code, codeChange };

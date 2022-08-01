import create from "./options/create.js";
import reactionRoles from "./options/reactionRoles.js";

export function interactionFilter(interaction, type = String) {
	if (!interaction.isCommand()) return;
	switch (type) {
		case "CREATE":
			createOption(interaction);
			break;

		default:
			break;
	}
}

function createOption(interaction) {
	switch (interaction.commandName) {
		case "code":
			create.code(interaction);
			break;
		case "codechange":
			create.codeChange(interaction);
			break;
		case "reaction_roles":
			reactionRolesOption(interaction);
			break;
		default:
			break;
	}
}

function reactionRolesOption(interaction) {
	console.log(`Reaction Roles Command Ran\n`);
	reactionRoles.vaildateOptions(interaction).catch(async (err) => {
		await interaction.reply({
			content: `Error! ${err}!`,
			ephemeral: true,
		});
	});
}

import code from "./options/code.js";
import reactionRoles from "./options/reactionRoles.js";
import moderation from "./options/moderation.js"

export function interactionFilter(interaction, type = String) {
	if (interaction.isCommand()){
		switch (type) {
			case "CREATE":
				createOption(interaction);
				break;
	
			default:
				break;
		}
	}else if(interaction.isButton()){
		switch (type) {
			case "CREATE":
				moderation.caseButtons(interaction,interaction.customId);
				break;
			default:
				break;
		}
	}else{
		return
	}
}

function createOption(interaction) {
	// console.log(interaction)
	switch (interaction.commandName) {
		case "code":
			code.code(interaction);
			break;
		case "codechange":
			code.codeChange(interaction);
			break;
		case "reaction_roles":
			reactionRolesOption(interaction);
			break;
		case "info":{
			moderation.info(interaction)
		}
		case "warn": {
			moderation.warn(interaction);
		}
		case "cases": {
			moderation.cases(interaction.options._subcommand,interaction)
		}
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
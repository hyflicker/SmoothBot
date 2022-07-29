import create from "./options/create.js";

export function interactionFilter(interaction, type = String) {
	if (!interaction.isCommand()) return;
	switch (type) {
		case "CREATE":
			create(interaction);
			break;

		default:
			break;
	}
}

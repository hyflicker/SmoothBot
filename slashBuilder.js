import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import "dotenv/config";
import { Routes, PermissionFlagsBits } from "discord-api-types/v10";
const clientId = process.env.clientId;
const token = process.env.botToken;
const guildId = process.env.guildId;

const smoothCommands = [
	new SlashCommandBuilder()
		.setName("code")
		.setDescription("sends the user the game code that has been set by an admin")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
	new SlashCommandBuilder()
		.setName("codechange")
		.setDescription("Changes the code that will be displayed when /code is used.")
		.addStringOption((option) =>
			option
				.setName("newcode")
				.setDescription("Enter the code that will be store to the /code command.")
				.setRequired(true),
		)
		.setDefaultMemberPermissions(
			PermissionFlagsBits.ViewAuditLog ||
				PermissionFlagsBits.ManageRoles ||
				PermissionFlagsBits.Administrator,
		),
	new SlashCommandBuilder()
		.setName("reaction_roles")
		.setDescription(
			"adds a new message with reactions to react to, to get a role.",
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("template")
				.setDescription(
					"create or edit template for reaction roles (Max Template: 1)",
				)
				.addStringOption((option) =>
					option
						.setName("type")
						.setDescription("something")
						.setRequired(true)
						.addChoices(
							{ name: "create", value: "create" },
							{ name: "edit", value: "edit" },
						),
				)
				.addChannelOption((option) =>
					option
						.setName("channel")
						.setDescription(
							"Selects the channel you wish the message to be posted in.",
						)
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("title")
						.setDescription("title of the reaction role message")
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("header")
						.setDescription("header of the reaction role message")
						.setRequired(false),
				)
				.addStringOption((option) =>
					option
						.setName("message")
						.setDescription("message before the reaction role message")
						.setRequired(false),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("template-delete")
				.setDescription("Removes your template you have create"),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("template-add-emote")
				.setDescription("adds and emote to existing template")
				.addStringOption((option) =>
					option
						.setName("emote")
						.setDescription("emote you would like to add to reaction role template")
						.setRequired(true),
				)
				.addRoleOption((option) =>
					option
						.setName("role")
						.setDescription(
							"selects the role that will be added/removed when reaction happens",
						)
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("description")
						.setDescription("describes what the emote does")
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("post")
				.setDescription("Posts the template that you have created with roles"),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("template-preview")
				.setDescription(
					"Sends you a preview of what the reaction role message will look like",
				),
		)
		.setDefaultMemberPermissions(
			PermissionFlagsBits.ViewAuditLog ||
				PermissionFlagsBits.ManageRoles ||
				PermissionFlagsBits.Administrator,
		),
].map((command) => command.toJSON());

const commands = [
	new SlashCommandBuilder()
		.setName("code")
		.setDescription("sends the user the game code that has been set by an admin"),
	new SlashCommandBuilder()
		.setName("codechange")
		.setDescription("Changes the code that will be displayed when /code is used.")
		.addStringOption((option) =>
			option
				.setName("newcode")
				.setDescription("Enter the code that will be store to the /code command.")
				.setRequired(true),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

// console.log(commands)
rest
	.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => {
		console.log("Commands Successfully Added!");
	})
	.catch(console.error);

rest
	.put(Routes.applicationGuildCommands(clientId, "839568492113297498"), {
		body: smoothCommands,
	})
	.then(() => {
		console.log("Commands Successfully Added To Smooth Server!");
	})
	.catch(console.error);

import {
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageSelectMenu,
	TextInputComponent,
	Modal,
} from "discord.js";
import { db } from "../../../Utilities/database.js";
import { errorHandler } from "../../../Utilities/errorLogging.js";
let data;

async function destination(interaction) {
	data = {
		channel: [],
		buttons: [],
	};

	let channels = interaction.guild.channels.cache.filter(
		(channels) => channels.type === "GUILD_TEXT",
	);
	let options = [];
	channels.forEach((c) => {
		let obj = {
			label: c.name,
			value: c.id,
		};
		options.push(obj);
	});
	const row = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("channelSelect")
			.setPlaceholder("Nothing selected")
			.addOptions(options),
	);
	await interaction.reply({
		content: `Please select what channel you'd like to add the reaction buttons to.`,
		components: [row],
		ephemeral: true,
	});
}

function vaildateOptions(interaction) {
	return new Promise((resolve, reject) => {
		console.log(interaction.options._subcommand);
		switch (interaction.options._subcommand) {
			case "template":
				template(interaction);
				break;
			case "template":
				template(interaction);
				break;
			case "template-delete":
				if (checkTemplates(interaction, interaction.user.id)) {
					deleteTemplate(interaction, interaction.user.id);
				}
			default:
				reject();
				break;
		}
	});
}

async function template(interaction) {
	let options = interaction.options._hoistedOptions;
	let type = options.find((o) => o.name === "type").value;
	let channel = options.find((o) => o.name === "channel");
	let channelName = channel.channel.name;
	let user = interaction.user.id;
	let title = options.find((o) => o.name === "title").value;
	let header = options.find((o) => o.name === "header");
	let message = options.find((o) => o.name === "message");
	let username = interaction.user.username;
	let templateResults = await checkTemplates(interaction, user);
	switch (type) {
		case "create":
			if (templateResults) {
				addTemplate();
			} else {
				await interaction.reply({
					content: `${username}, you currently have a pending template. To delete the pending template use /reaction_roles template-delete or to edit use edit type when using /reaction_roles template.`,
					ephemeral: true,
				});
			}
			break;
		case "edit":
			if (!templateResults) {
				editTemplate();
			} else {
				await interaction.reply({
					content: `${username}, you currently do not have a template. Ues the create type and create a template.`,
				});
			}
			break;

		default:
			break;
	}
	function addTemplate() {
		checkHeaderAndMessage();
		db
			.promise()
			.execute(
				`INSERT INTO reaction_role_templates (channel,channelName,title,header,message,user) VALUES (?,?,?,?,?,?)`,
				[channel.value, channelName, title, header.value, message.value, user],
			)
			.then(async ([res]) => {
				if (res.affectedRows >= 1) {
					await interaction.reply({
						content: `${username}, your template has been added. To add emotes with roles run /reaction_roles template-add-emote`,
						ephemeral: true,
					});
				}
			})
			.catch((err) => {
				errorHandler(err);
			});
	}
	function editTemplate() {
		checkHeaderAndMessage();
		db
			.promise()
			.execute(
				`UPDATE reaction_role_templates SET channel = ?, channelName = ?, title = ?, header = ?, message= ? WHERE user = ?`,
				[channel.value, channelName, title, header.value, message.value, user],
			)
			.then(async ([res]) => {
				if (res.affectedRows >= 1) {
					await interaction.reply({
						content: `${username}, your template has been editted. To add emotes with roles run /reaction_roles template-add-emote`,
						ephemeral: true,
					});
				} else {
					errorHandler("Issue editing template for reaction roles");
					await interaction.reply({
						content: `${username}, there was an error editing your template. Please try again later.`,
						ephemeral: true,
					});
				}
			})
			.catch((err) => {
				errorHandler(err);
			});
	}
	function checkHeaderAndMessage() {
		if (header === undefined) header = { value: null };
		if (message === undefined) message = { value: null };
	}
}

function checkTemplates(interaction, user) {
	return new Promise((resolve, reject) => {
		db
			.promise()
			.execute(`SELECT * FROM reaction_role_templates WHERE user = ?`, [user])
			.then(async ([res]) => {
				if (res.length === 0) {
					resolve(true);
				} else {
					resolve(false);
				}
			})
			.catch(async (err) => {
				errorHandler(err);
				await interaction.reply({
					content: `Check Template Error! ${err}!`,
					ephemeral: true,
				});
			});
	});
}

function deleteTemplate(interaction, user) {
	db
		.promise()
		.execute(`DELETE FROM reaction_role_templates WHERE user = ?`, [user])
		.then(async ([res]) => {
			console.log(res);
			if (res.affectedRows >= 1) {
				await interaction.reply({
					content: `${interaction.user.username}, your template has been delete. If you want to create a new template, run /reaction_roles with type create.`,
					ephemeral: true,
				});
			}
		})
		.catch(async (err) => {
			errorHandler(err);
		});
}
export default { destination, vaildateOptions };

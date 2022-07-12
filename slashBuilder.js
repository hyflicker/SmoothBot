const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
require('dotenv').config();
const { Routes, PermissionFlagsBits } = require('discord-api-types/v10');
const clientId = process.env.clientId;
const token = process.env.botToken;
const guildId = process.env.guildId;

const smoothCommands = [
    new SlashCommandBuilder()
        .setName('code')
        .setDescription('sends the user the game code that has been set by an admin')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    new SlashCommandBuilder()
        .setName('codechange')
        .setDescription('Changes the code that will be displayed when /code is used.')
        .addStringOption(option => 
            option.setName('newcode')
                .setDescription('Enter the code that will be store to the /code command.')
                .setRequired(true)
        )
        .setDefaultMemberPermissions( PermissionFlagsBits.ViewAuditLog || PermissionFlagsBits.ManageRoles || PermissionFlagsBits.Administrator)

]
    .map(command => command.toJSON());

    const commands = [
        new SlashCommandBuilder()
            .setName('code')
            .setDescription('sends the user the game code that has been set by an admin'),
        new SlashCommandBuilder()
            .setName('codechange')
            .setDescription('Changes the code that will be displayed when /code is used.')
            .addStringOption(option => 
                option.setName('newcode')
                    .setDescription('Enter the code that will be store to the /code command.')
                    .setRequired(true)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    
    ]
        .map(command => command.toJSON());

const rest = new REST({version: '10'}).setToken(token);

// console.log(commands)
rest.put(Routes.applicationGuildCommands(clientId,guildId), {body: commands})
    .then(() =>{
        console.log('Commands Successfully Added!')
    })
    .catch(console.error);

    rest.put(Routes.applicationGuildCommands(clientId,'839568492113297498'), {body: smoothCommands})
    .then(() =>{
        console.log('Commands Successfully Added To Smooth Server!')
    })
    .catch(console.error);
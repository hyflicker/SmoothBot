require('./slashBuilder')
const Discord = require('discord.js');
const mysql = require('mysql2');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE','CHANNEL','REACTION']
});
const fs = require('fs')

require('dotenv').config();

const dbConfig = {
    host: 'localhost',
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
}

let db;

function handleDisconnect() {
    db = mysql.createConnection(dbConfig);

    db.connect(function(err) {
        if(err){
            console.error('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    db.on('error', function(err){
        console.log('db error', err);
        errorHandler(err)
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            handleDisconnect();
        }else{
            throw err;
        }
    });
}

handleDisconnect();

const errorHandler = function (error){
    try {
        let timestamp = new Date();
        let data = `${timestamp}: Error - ${error} \n`
        fs.appendFileSync('./logs/error.log',data)
    } catch (e) {
        console.log('ERROR: ',e)
    }
}

client.on('ready', () => {
    console.log(`${client.user.tag} is Online!`);
})

client.on('messageReactionAdd', async (reaction,user) =>{
    
    if(reaction.message.channelId === '904080384843714560'){
        console.log(`${user.username} reactionAdd with ${reaction.emoji.name}`)
        if(reaction.partial){
            try {
                await reaction.fetch();
                db.execute(`SELECT * FROM reactionroles WHERE reactionName = '${reaction.emoji.name}' AND messageId = ${reaction.message.id}`, (err, results) => {
                    if(err){errorHandler(err); return};
                    if(results.length > 0){
                        reaction.message.guild.members.cache.get(user.id).roles.add(`${results[0].roleId}`)
                    }
                })
            } catch (error) {
                errorHandler(error)
                return
            }

        }
    }
})

client.on('messageReactionRemove', async (reaction,user) =>{
    if(reaction.message.channelId === '904080384843714560'){
        console.log(`${user.username} reactionRemove with ${reaction.emoji.name}`)
        try {
            await reaction.fetch();
            db.execute(`SELECT * FROM reactionroles WHERE reactionName = '${reaction.emoji.name}' AND messageId = ${reaction.message.id}`, (err, results) => {
                if(err){errorHandler(err); return};
                if(results.length > 0){
                    reaction.message.guild.members.cache.get(user.id).roles.remove(`${results[0].roleId}`)
                }
            })
        } catch (error) {
            errorHandler(error)
            return
        }
    }
})

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;
    switch (interaction.commandName) {
        case "code":
            db.execute(`SELECT * FROM commandresponses WHERE commandName = '${interaction.commandName}' AND guildId = ${interaction.guildId}`, async (err,res) => {
                if(err){errorHandler(err); return};
                if(res.length > 0){
                    await interaction.reply({content:`The code is ${res[0].commandResponse}!`, ephemeral: true})
                }else{
                    await interaction.reply({content: `Error! Please try again later or have a mod to create a code.`})
                }
            })
            break;
        case "codechange":
            let newCode = interaction.options['_hoistedOptions'][0].value;
            db.execute(`UPDATE commandresponses SET commandResponse = '${newCode}' WHERE commandName = 'code' AND guildId = ${interaction.guildId}`, async (err, res)=>{
                if(err){errorHandler(err.sqlMessage); return};
                if(res.affectedRows > 0){
                    await interaction.reply({content: `Code is now updated to ${newCode}`, ephemeral: true})
                }else{
                    db.execute(`INSERT INTO commandresponses (commandName,commandResponse,guildId) VALUES ('code','${newCode}','${interaction.guildId}')`, async (err,results) => {
                        if(err)errorHandler(err);
                        if(results.affectedRows > 0){
                            await interaction.reply({content: `Code is now updated to ${newCode}`, ephemeral: true});
                        }else{
                            await interaction.reply({content: `Error! Please try again later.`})
                        }
                    })
                }
            })
            break;
        default:
            break;
    }
})

let botOnInt;

function setInt(){
    botOn()
    botOnInt = setInterval(botOn, 60000);
    client.once('ready', () => {
        clearInterval(botOnInt)
    })
}
function botOn(){
    try {
        client.login(process.env.botToken);
    } catch {
        console.log("There was an error logging in. Check your internet connection.")
    }
}
setInt();
require('./slashBuilder')
const Discord = require('discord.js');
const mysql = require('mysql2');
const {MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, TextInputComponent, Modal} = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE','CHANNEL','REACTION']
});

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
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            handleDisconnect();
        }else{
            throw err;
        }
    });
}

handleDisconnect();

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
                    if(results.length > 0){
                        reaction.message.guild.members.cache.get(user.id).roles.add(`${results[0].roleId}`)
                    }
                })
            } catch (error) {
                console.error('Error',error)
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
                if(results.length > 0){
                    reaction.message.guild.members.cache.get(user.id).roles.remove(`${results[0].roleId}`)
                }
            })
        } catch (error) {
            console.error('Error',error)
            return
        }
    }
})

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;
    switch (interaction.commandName) {
        case "code":
            db.execute(`SELECT * FROM commandresponses WHERE commandName = '${interaction.commandName}'`, async (err,res) => {
                if(err)console.error;
                await interaction.reply({content:`The code is ${res[0].commandResponse}!`, ephemeral: true})
            })
            break;
        case "codechange":
            let newCode = interaction.options['_hoistedOptions'][0].value;
            db.execute(`UPDATE commandresponses SET commandResponse = '${newCode}' WHERE commandName = 'code'`, async (err, res)=>{
                if(err)console.error;
                console.log(res)
                if(res.affectedRows > 0){
                    await interaction.reply({content: `Code is now updated to ${newCode}`, ephemeral: true})
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
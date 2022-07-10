const Discord = require('discord.js');
const mysql = require('mysql2');
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
        if(err.fatal == true){
            handleDisconnect();
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
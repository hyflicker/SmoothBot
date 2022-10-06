import { db } from "../../../Utilities/database.js";
import { errorHandler } from "../../../Utilities/logging.js";
import {
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageSelectMenu,
	TextInputComponent,
	Modal,
} from "discord.js";
import moment from 'moment'
import e from "express";

const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June",
  "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."
];

async function info (interaction) {
    const user = interaction.options._hoistedOptions[0].user;
    const guildMember = interaction.options._hoistedOptions[0].member;
    const currentDate = moment.utc(new Date())
    const msgEmbed = new MessageEmbed()
        .setColor('DARKER_GREY')
        .setAuthor({name:`User: ${user.tag}\ `,iconURL: user.avatarURL()})
        .setTitle('\u200B')
        .addFields(
            
            {name:'User Information:',value:`Name: **${user.username}** \n ID: \`${user.id}\` \n Created: **${calcDate(currentDate,moment.utc(user.createdTimestamp))} ** (\`${moment.utc(user.createdTimestamp).format("MMM Do, YYYY")} at ${moment.utc(user.createdTimestamp).format("HH:mm UTC")}\`)\n Mention: <@${user.id}>`}, //${monthNames[discordJoinDate.getUTCMonth()]} ${discordJoinDate.getUTCDate()}, ${discordJoinDate.getUTCFullYear()} at ${discordJoinDate.getUTCHours()}:${discordJoinDate.getUTCMinutes()} UTC
            {name: '_ _', value: '_ _'},
            {name: 'Member Info', value: `Joined: **${calcDate(currentDate,moment.utc(guildMember.joinedTimestamp))}** (\`${moment.utc(guildMember.joinedTimestamp).format("MMM Do, YYYY")} at ${moment.utc(guildMember.joinedTimestamp).format("HH:mm UTC")}\`)\n Roles: ${getRoles(guildMember)}`},
            
        )
    await interaction.reply({embeds: [msgEmbed] , ephemeral: true})
}

function getRoles(member){
    const roleArray = []
    member.roles.cache.sorted((a,b) => b.rawPosition - a.rawPosition).forEach(role => {
        roleArray.push(`<@&${role.id}>`)
    });
    roleArray.pop()
    return roleArray.toString();
}

function calcDate(a,b) {
    var years = a.diff(b, 'year');
    b.add(years, 'years');

    var months = a.diff(b, 'months');
    b.add(months, 'months');

    let days = a.diff(b, 'days');
    b.add(days, 'days');

    let hours = a.diff(b, 'hours');
    b.add(hours, 'hours');

    let minutes = a.diff(b, 'minutes');
    b.add(minutes, 'minutes')
    let weeks = Math.abs(days/7);
    days = days - (weeks*7); 

    console.log(years + ' years ' + months + ' months ' + days + ' days ' + hours + ' hours ' + minutes + 'minutes.'); 
    let message;
    if(years > 0){
        if(years === 1 && months === 1){
            message = `${years} year, ${months} month ago `;
        }else if(years === 1 && months > 1){
            message = `${years} year, ${months} months ago `;
        }else{
            message = `${years} years, ${months} months ago `;
        }
    }else if(months > 0){
        if(months === 1 && weeks === 1){
            message = `${months} month, ${weeks} week ago `;
        }else if(months === 1 && weeks > 1){
            message = `${months} month, ${weeks} weeks ago `;
        }else{
            message = `${months} months, ${weeks} weeks ago `;
        }
    }else if(weeks > 0){
        if(weeks === 1 && days === 1){
            message = `${weeks} week, ${days} day ago `;
        }else if(weeks === 1 && days > 1){
            message = `${weeks} week, ${days} days ago `;
        }else{
            message = `${weeks} weeks, ${days} days ago `;
        }
    }else if(days > 0) {
        if(days === 1 && hours === 1){
            message = `${days} day, ${hours} hour ago `;
        }else if (days === 1 && hours > 1){
            message = `${days} day, ${hours} hours ago `;
        }else{
            message = `${days} days, ${hours} hours ago `;
        }
    }else if(hours > 0){
        if(hours === 1 && minutes ===1){
            message = `${hours} hour, ${minutes} minute ago `;
        }else if(hours === 1 && minutes > 1){
            message = `${hours} hour, ${minutes} minutes ago `;
        }else{
            message = `${hours} hours, ${minutes} minutes ago `;
        }
    }else{
        if(minutes === 1){
            message = `${minutes} minute ago `;
        }else{
            message = `${minutes} minutes ago `;
        }
    }

    return message
}

async function checkCases(guildId){
    let cases = db.promise().execute(`SELECT cases FROM guilds WHERE guildId = ?`, [guildId])
    .then(([res]) => {
        return res[0].cases;
    })
    .catch((err) => {
        errorHandler(err);
        return `Error with Case read.`
    })
    return cases;
}

async function dmUser(options){
    let user = options.find((user) => user.type === 'USER').user;
    return user.send(`${options.find((msg) => msg.type === "STRING").value}`)
    .then(()=> {
        return true
    })
    .catch((err) => {
        errorHandler(err);
        return false;
    })
}

let collector = [];
async function collectorObject(id,user,moderator,message){
    let obj = {
        Id: id,
        User: user,
        Moderator: moderator,
        Message: message,
    }
    console.log(id);
    collector.push(obj);
     setTimeout(() => {
        if(collector.map((obj) => obj.user === user)){
            collector.splice(collector.findIndex((e)=> e.Id === id), 1);
        }else{  
            return
        }
    }, 10000);
}

async function updateCaseCount(caseNum,guildId){
    return db.promise().execute(`UPDATE guilds SET cases = ? WHERE guildId = ?`,[(caseNum + 1), guildId])
    .then(([res]) => {
        if(res.affectedRows !== 0){
            return true;
        }else{
            return false;
        }
    })
}

async function caseEmbed(guildId,caseId){
    const data = await db.promise().execute(`SELECT * FROM cases WHERE guildId = ? AND caseId = ?`,[guildId,caseId])
        .then(([res]) => {
            if(res.length > 0){
                return res[0];
            }else{
                return false;
            } 
        })
        .catch((err) => {
            errorHandler(err)
            return false;
        })
    if(data){
        const numCases = await db.promise().execute(`SELECT Count(userName) FROM cases WHERE guildId = ? AND userName = ?`,[guildId,data.userName])
        .then(([res]) => {
            return res[0][`Count(userName)`];
        })
        .catch((err) => {
            errorHandler(err)
            return
        })
    const timestamp = moment(data.timestamp);
    let type;
    if(data.type === 'dmUSER'){
        type = `[User nodified with a direct message]`;
    }else if(data.type === 'caseButtons'){
        type = `[User was not notified due to DMs being turned off]`;
    }
    let embed = {
        color: `#FEE75C`,
        title: `WARN - Case #${caseId}`,
        fields:[
            {
                name: `User`,
                value: `\n${data.userName}\n<@${data.userId}>`,
                inline:true
            },
            {
                name: `Moderator`,
                value: `\n${data.moderatorName}\n<@${data.moderatorId}>`,
                inline:true
            },
            {
                name: `${data.moderatorName} warned ${data.userName} on ${timestamp.format(`MMM Do YYYY`)} at ${timestamp.format(`HH:mm`)} UTC:`,
                value: `${type} ${data.message}`
            }
        ],
        footer: {
            text:`Case created on ${timestamp.format(`MMM Do YYYY`)} at ${timestamp.format(`HH:mm`)} UTC\nNumber of cases against ${data.userName}: ${numCases}`
        }
    }
     return embed;
    }else{
        return 'NO-CASE';
    }


}

async function insertCase(guildId,caseId,userName,userId,moderatorName,moderatorId,message,type){
    return db.promise().execute(`INSERT INTO cases (guildId,caseId,userName,userId,moderatorName,moderatorId,message,type) VALUES(?,?,?,?,?,?,?,?)`,
    [guildId,caseId,userName,userId,moderatorName,moderatorId,message,type])
}

async function addCase(interaction,type){
    const cases = await checkCases(interaction.guildId)
    if(type === 'dmUSER'){
        const options = interaction.options._hoistedOptions
    //     db.promise().execute(`INSERT INTO cases (guildId,caseId,userName,userId,moderatorName,moderatorId,message,type) VALUES(?,?,?,?,?,?,?,?)`,
    // [`${interaction.guildId}`,`${cases+1}`,`${options.filter((obj) => obj.type === 'USER')[0].user.username}`,`${options.filter((obj) => obj.type === 'USER')[0].user.id}`,`${interaction.user.username}`,`${interaction.user.id}`,`${options.filter((obj) => obj.type === 'STRING')[0].value}`,'dmUSER'])
    insertCase(`${interaction.guildId}`,`${cases+1}`,`${options.filter((obj) => obj.type === 'USER')[0].user.username}`,`${options.filter((obj) => obj.type === 'USER')[0].user.id}`,`${interaction.user.username}`,`${interaction.user.id}`,`${options.filter((obj) => obj.type === 'STRING')[0].value}`,'dmUSER')
    .then(async([res])=> {
        if((res.affectedRows > 0) && (updateCaseCount(cases,interaction.guildId))){
            // await interaction.reply({content:`Case #${cases + 1} has been submitted against ${options.filter((obj) => obj.type === 'USER')[0].user.username}`, ephemeral:true})
            await interaction.reply({embeds: [await caseEmbed(interaction.guildId,cases+1)],ephemeral:true})
        }
    })
    .catch(async(err) => {
        errorHandler(err);
        console.log(err)
        await interaction.reply({content:`There was an ERROR. Please try again.`,ephemeral: true})
    })
    }else{
        const caseData = collector[collector.findIndex((e)=> e.Id === interaction.message.interaction.id)]
        insertCase(`${interaction.guildId}`,`${cases+1}`,`${caseData.User.username}`,`${caseData.User.id}`,`${caseData.Moderator.username}`,`${caseData.Moderator.id}`,`${caseData.Message}`,`${type}`)
        .then(async(res) => {
            if((res[0].affectedRows > 0) && (updateCaseCount(cases,interaction.guildId)) && (await checkCaseDestination(interaction.guildId))){
                // await client.channels.cache.get(checkCaseDestination(interaction.guildId)).send(`Hi`)
                await interaction.guild.channels.fetch(`${await checkCaseDestination(interaction.guildId)}`)
                .then(async channel => {
                    await channel.send({embeds: [await caseEmbed(interaction.guildId,cases+1)]});
                    await interaction.update({embeds:[await caseEmbed(interaction.guildId,cases+1)],components:[],ephemeral:true})
                })
                .catch(err=>{
                    errorHandler(err);
                })
            }else{
                await interaction.update({embeds:[await caseEmbed(interaction.guildId,cases+1)],components:[],ephemeral:true})
            }
        })
    }
}

async function checkCaseDestination(guildId){
    return await db.promise().execute(`SELECT caseDestination FROM guilds WHERE guildId = ?`,[guildId])
    .then(([res]) => {
        if(res[0].caseDestination){
            return res[0].caseDestination;
        }else{
            return false;
        }
    })
    .catch((err) => {
        errorHandler(err)
        return false;
    })
}

async function questionAddCase(interaction){
    const user = interaction.options._hoistedOptions[0].user;
    const embed = new MessageEmbed()
    .setColor('YELLOW')
    .setAuthor({name:`User: ${user.tag}\ `,iconURL: user.avatarURL()})
    .setTitle(`Looks like I can't DM this user. Would you still like to add a Case against this user?`);
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('moderationCasesYes')
                .setLabel('Yes')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('moderationCasesNo')
                .setLabel('No')
                .setStyle('DANGER')
        )
    await interaction.reply({embeds: [embed],components: [row],ephemeral: true})
    collectorObject(interaction.id,user,interaction.user,interaction.options._hoistedOptions.find((msg) => msg.type === "STRING").value);
}
async function caseButtons(interaction,type){
    if(type === 'moderationCasesYes'){
        addCase(interaction,'caseButtons');
    }else if(type === 'moderationCasesNo'){
        const embed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(`Ok! We won't make a case. -Thank you!`);
        await interaction.update({embeds: [embed],components: [],ephemeral: true})
    }
}

async function warn (interaction){
    if(await dmUser(interaction.options._hoistedOptions)){
        addCase(interaction, 'dmUSER')
    }else{
        console.log(`ERROR: User can't receive DMs`)
        questionAddCase(interaction)
    }
}

async function cases (type,interaction){
    switch (type) {
        case 'add':
            const user = interaction.options._hoistedOptions[0].user;
            collectorObject(interaction.id,user,interaction.user,interaction.options._hoistedOptions.find((msg) => msg.type === "STRING").value);
            addCase(interaction,'NON-DM')
            .catch(err => 
                    errorHandler(err)
                )
            break;
        case 'delete':
            
            break;
        case 'view':
            casesView(interaction)
            break;
    
        default:
            break;
    }
}

async function casesView (interaction){
    const caseId = interaction.options._hoistedOptions[0].value;
    let data = await caseEmbed(interaction.guildId,caseId);
    let embed;
    if((data) && (data !== 'NO-CASE')){
       embed = data;
    }else if(data === 'NO-CASE'){
        embed = {
            color: `#FEE75C`,
            title: `ERROR - No Case Found`,
            description: `Looks like the case you are looking for does not exist.`,
        }
    }else{
        embed = {
            color: `#FEE75C`,
            title: `ERROR - Unknown`,
            description: `Looks like we hit an unexpected error.`,
        }
        
    }
    await interaction.reply({embeds: [embed],ephemeral:true})
    
}

async function casesDelete (interaction){

}

async function errorResponse(interaction){
    await interaction.reply({content: `There was an error processing your request. Please try again later.`,ephemeral:true})
}

export default { info, warn, caseButtons, cases }
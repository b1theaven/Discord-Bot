const Discord = require("discord.js")
const moment = require('moment');
const lang = require("../language")
const status = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline/Invisible"
};

module.exports = {
   name: 'whois',
  aliases: ["userinfo", "memberinfo"],
    run: async (client, message, args) => {
      const msg = message
        var permissions = [];
        let acknowledgements = ':x:';
        let whoisPermErr = new Discord.MessageEmbed()
        .setTitle("**User Permission Error!**")
        .setDescription("**Sorry, you don't have permissions to use this! ❌**")

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        

        if(member.permissions.has("KICK_MEMBERS")){
            permissions.push("Kick Members");
        }
        
        if(member.permissions.has("BAN_MEMBERS")){
            permissions.push("Ban Members");
        }
        
        if(member.permissions.has("ADMINISTRATOR")){
            permissions.push("Administrator");
        }
    
        if(member.permissions.has("MANAGE_MESSAGES")){
            permissions.push("Manage Messages");
        }
        
        if(member.permissions.has("MANAGE_CHANNELS")){
            permissions.push("Manage Channels");
        }
        
        if(member.permissions.has("MENTION_EVERYONE")){
            permissions.push("Mention Everyone");
        }
    
        if(member.permissions.has("MANAGE_NICKNAMES")){
            permissions.push("Manage Nicknames");
        }
    
        if(member.permissions.has("MANAGE_ROLES")){
            permissions.push("Manage Roles");
        }
    
        if(member.permissions.has("MANAGE_WEBHOOKS")){
            permissions.push("Manage Webhooks");
        }
    
        if(permissions.length == 0){
            permissions.push("-");
        }
    
        if(member.user.id === message.guild.ownerId){
            acknowledgements = 'Server Owner';
        }
      const flags = {
	DISCORD_EMPLOYEE: '<:staff:809959358770839563>',
	DISCORD_PARTNER: '<:partner:809960688205955082>',
	BUGHUNTER_LEVEL_1: '<:BUGHUNTER_LEVEL_1:789510617618710529>l',
	BUGHUNTER_LEVEL_2: '<:BUGHUNTER_LEVEL_2:789510560928104469>',
	HYPESQUAD_EVENTS: '<:events:809960288802963496>',
	HOUSE_BRAVERY: '<:emoji_36:804757099442995230>',
	HOUSE_BRILLIANCE: '<:hbl:795197635678044190>',
	HOUSE_BALANCE: '<:emoji_38:804757141851209759>',
	EARLY_SUPPORTER: 'Early Supporter',
	TEAM_USER: 'Team User',
	SYSTEM: 'System',
	VERIFIED_BOT: '<:peripid:802524965958189086>',
	VERIFIED_DEVELOPER: '<:dev:801735439836905493>'
};
        const flage = member.user.flags.toArray()
        const embed = new Discord.MessageEmbed()
            .setDescription(`<@${member.user.id}>`)
            .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL())
            .setColor(member.displayHexColor ? member.displayHexColor : "#FFFFFF")
            .setFooter(`ID: ${message.author.id}`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp()
            .addField(member.user.bot ? lang(msg.guild, "MEMBER_USER_BOT") : lang(msg.guild, "USER_INFORMATION"), `**Status: **${member.presence ? status[member.presence.status] : "Offline"}\n**${lang(msg.guild, "PLAYING")}**: ${member.presence?.activities.find(on => on.type === "CUSTOM")?.state || " "}\n**${lang(msg.guild, "CREATED_ON")}:** ${member.user.createdTimestamp ? `<t:${Math.floor(member.user.createdTimestamp / 1000)}:D>` : "Unknown"}\n**Badges:** ${flage.length ? flage.map(flag => flags[flag]).join("") : "-"}`)
            .addField(member.user.bot ? lang(msg.guild, "MEMBER_BOT") : lang(msg.guild, "MEMBER_INFORMATION"), `**${lang(msg.guild, "JOINED_SERVER")}:** ${member.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>` : 'Unknown'}\n**${lang(msg.guild, "ROLES")}** **[${member.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `\`${roles.name}\``).length}]:** ${member.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `<@&${roles.id }>`).join(" , ") || "-"}\n**Acknowledgements:** ${acknowledgements}`)
            .addField("_ _" + "\n" +lang(msg.guild, "PERMISSIONS"), `${permissions.join(` | `)}`, true)
            
        message.channel.send({embeds: [embed]});
    }
}
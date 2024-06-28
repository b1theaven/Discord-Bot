const {stripIndents} = require("common-tags")
const Discord = require("discord.js")
const moment = require("moment")
const lang = require('../language')
module.exports = {
    name: "topgginfo",
    aliases: ["dblinfo"],
    cooldown: 8,
    run: async (client, msg, args) => {
        const bot = msg.mentions.members.first()
        if(!bot) return msg.channel.send({ content: lang(msg.guild, "MENTION_BOT") })
        client.dbl.getBot(bot.user.id).then(async stats => {
            const owner = stats.owners[0]
            const user = await client.users.fetch(owner, { cache: true })
            let embed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Ie-w97Y-11Uj9Nwt4cupzpTHI1-7Ji6vOw&usqp=CAU")
            .setAuthor(bot.user.tag, client.users.cache.get(stats.clientid).displayAvatarURL())
            .setDescription(stats.shortdesc)
            .addFields(
                { name: lang(msg.guild, "INFORMATION"), value: stripIndents`
${lang(msg.guild, "OWNER")}: ${user.username}#${user.discriminator}
Prefix: ${stats.prefix ? stats.prefix : "-"}
Library: ${stats.lib ? stats.lib : "Unknown"}
Tags: ${stats.tags.join(", ")}
${lang(msg.guild, "APPROVED_DATE")}: ${moment(stats.date)}`, },
                { name: "VOTES", value: stripIndents`
${lang(msg.guild, "ALL_VOTES")}: ${stats.points ? stats.points : "0"}
${lang(msg.guild, "MONTHLY_VOTES")}: : ${stats.monthlyPoints ? stats.monthlyPoints : "0"}`, inline: true },
                { name: "SUPPORT", value: stripIndents`
Github: ${stats.github ? stats.github : "-"}
${lang(msg.guild, "WEBSITE")}: ${stats.website ? stats.website : "-"}
${lang(msg.guild, "INVITE")}: [Click Here](${stats.invite})`, inline: true },
                )
            .setFooter("TOP.GG")
            msg.channel.send({ embeds: [embed] })
        }).catch(e => msg.channel.send({ content: e.message}))
    }
}
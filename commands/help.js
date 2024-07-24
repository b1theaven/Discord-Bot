const { MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { stripIndents } = require('common-tags');
const lang = require('../language');

module.exports = {
    name: 'help',
    aliases: ['h'],
    run: async (client, msg, args) => {
        const embed = new MessageEmbed()
            .setColor('PURPLE')
            .setAuthor(`${lang(msg.guild, 'COMMANDS_LIST')} - ${client.commands.size} ${lang(msg.guild, 'COMMANDS')}`)
            .setThumbnail(msg.guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '<:crystal_ball:885185036419219496> Boosters', value: stripIndents`
> \`role create\`, \`role edit\`, \`role give\`` },
                { name: '<:hammer:885195095840804885> Utility ' + lang(msg.guild, 'COMMANDS'), value: stripIndents`
> \`avatar\`, \`ping\`, \`youtubedownload\`, \`emojilist\`, \`movie\`, \`say\`, \`remindme\`, \`cancelremind\`, \`listreminder\`, \`snipe\`, \`google\`, \`ytstats\`, \`afk\`` },
                { name: '<:shield:885185036419219496> Moderation', value: stripIndents`
> \`setprefix\`, \`setlanguage\`, \`clear\`, \`addemoji\`, \`backup\`, \`kick\`, \`ban\`, \`giveaway\`, \`nuke\`, \`unban\`, \`reminder\`, \`removeremind\`` },
                { name: "<:chart:885185036419219496> Slash "+ lang(msg.guild, "COMMANDS"), value: stripIndents`
> \`avatar\`, \`serveravatar\`, \`automod-flaggedword\`, \`automod-keyword\`, \`automod-mentionspam\`, \`ban\`, \`kick\`, \`setlanguage\`, \`setprefix\`, \`reloadcommands\`, \`youtubedownload\`` },
                { name: '<:information_source:885192830283313232> Information ' + lang(msg.guild, 'COMMANDS'), value: stripIndents`
> \`steam\`, \`playstore\`, \`topgginfo\`, \`device\`, \`worldclock\`, \`permissions\`, \`whois\`, \`stats\`, \`leaderboard\`` },
            )
            .setFooter('Apabila terdapat bug pada bot ini silahkan gunakan a.reportbug [bug] , terimakasih!');
            
        msg.channel.send({ embeds: [embed] });
    }
};

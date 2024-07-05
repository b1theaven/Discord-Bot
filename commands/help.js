const { MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
const {stripIndents} = require('common-tags')
const lang = require("../language")
module.exports = {
    name: 'help',
    aliases: ['h'],
    run: async (client, msg, args) => {
      const inviteButton = new MessageButton()
      .setURL("https://discord.com/oauth2/authorize?client_id=999134155910688773&permissions=8&integration_type=0&scope=bot+applications.commands")
      .setLabel("Invite me!")
      .setStyle("LINK")
      const supportButton = new MessageButton()
      .setURL("https://discord.gg/J4rBuvHskq")
      .setLabel("Join our server!")
      .setStyle("LINK")
      
      
      
      const row = new MessageActionRow()
      .addComponents(
        inviteButton,
        supportButton
        )
        const embed = new MessageEmbed()
        .setColor("PURPLE")
        .setAuthor(`${lang(msg.guild, "COMMANDS_LIST")} - ${client.commands.size} ${lang(msg.guild, "COMMANDS")}`)
        .setThumbnail(msg.guild.iconURL({dynamic: true}))
        .addFields(
            { name: "<:hammer:885195095840804885> Utility "+ lang(msg.guild, "COMMANDS"), value: stripIndents`
> \`avatar\`, \`ping\`, \`youtubedownload\`, \`emojilist\`, \`movie\`, \`say\`` },
            { name: "<:shield:885185036419219496> Moderation", value: stripIndents`
> \`setprefix\`, \`setlanguage\`, \`clear\`, \`addemoji\`, \`backup\`, \`kick\`, \`ban\`, \`giveaway\`, \`nuke\`, \`reminder\`` },
            { name: "<:information_source:885192830283313232> Information "+ lang(msg.guild, "COMMANDS"), value: stripIndents`
> \`steam\`, \`playstore\`, \`topgginfo\`, \`device\`, \`worldclock\`, \`permissions\`, \`whois\`, \`stats\`` },
        )
        .setFooter("Apabila terdapat bug pada bot ini silahkan gunakan a.reportbug [bug] , terimakasih!")
        msg.channel.send({ embeds: [embed], components: [row] })
    }
}

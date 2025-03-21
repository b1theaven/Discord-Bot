const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const { stripIndents } = require("common-tags");
const lang = require("../language");

module.exports = {
  name: "help",
  aliases: ["h"],
  run: async (client, msg, args) => {
    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setAuthor(
        `${lang(msg.guild, "COMMANDS_LIST")} - ${client.commands.size} ${lang(
          msg.guild,
          "COMMANDS"
        )}`
      )
      .setThumbnail(msg.guild.iconURL({ dynamic: true }))
      .addFields(
        {
          name: "<:crystal_ball:885185036419219496> Boosters",
          value: stripIndents`
> \`role create\`, \`role edit\`, \`role give\``,
        },
        {
          name:
            "<:hammer:885195095840804885> Utility " +
            lang(msg.guild, "COMMANDS"),
          value: stripIndents`
> \`avatar\`, \`ping\`, \`banner\`, \`youtubedownload\`, \`emojilist\`, \`downloader\`, \`help\`, \`pinterest\`, \`movie\`, \`say\`, \`remindme\`, \`cancelremind\`, \`listreminder\`, \`snipe\`, \`google\`, \`ytstats\`, \`afk\`, \`nasa\`, \`cuddle\`, \`hug\`, \`kiss\`, \`pat\`, \`slap\`, \`youtube\``,
        },
        {
          name: "<:shield:885185036419219496> Moderation Commands & Slash Commands",
          value: stripIndents`
> \`setprefix\`, \`setlanguage\`, \`reloadcommands\`, \`blacklist\`, \`auto-message\`, \`reactionrole-add\`, \`reactionrole-remove\`, \`automod-flaggedword\`, \`automod-keyword\`, \`automod-mentionspam\`, \`ban\`, \`kick\`, \`admin-level\`, \`admin-panel\`, \`mod-panel\`, \`starboard-setup\`, \`starboard-remove\`, \`setlanguage\`, \`setprefix\`, \`clear\`, \`addemoji\`, \`confession-delete\`, \`confession-blacklist\`, \`confession-remove\`, \`confession-setup\`, \`confession-unblacklist\`, \`eval\`, \`backup\`, \`kick\`, \`ban\`, \`giveaway\`, \`nuke\`, \`unban\`, \`reminder\`, \`removeremind\``,
        },
        {
          name:
            "<:chart:885185036419219496> Slash " + lang(msg.guild, "COMMANDS"),
          value: stripIndents`
> \`avatar\`, \`imagine\`, \`confess\`, \`bmkg\`, \`rank\`, \`chat-gpt\`, \`lastfm\`, \`lastfm-set\`, \`lastfm-whoknows\`, \`lastfm-top\`, \`lookingforgroup\`, \`wordfight\`, \`translate\`, \`serveravatar\`, \`playstore\`, \`appstore\`, \`leaderboard\`, \`lyrics\`, \`movie\`, \`pinterest\`, \`youtubedownload\``,
        },
        {
          name:
            "<:information_source:885192830283313232> Information " +
            lang(msg.guild, "COMMANDS"),
          value: stripIndents`
> \`steam\`, \`playstore\`, \`topgginfo\`, \`device\`, \`appstore\`, \`firstmessage\`, \`worldclock\`, \`permissions\`, \`whois\`, \`stats\`, \`leaderboard\``,
        }
      )
      .setFooter(
        "Apabila terdapat bug pada bot ini silahkan gunakan a.reportbug [bug] , terimakasih!"
      );

    msg.channel.send({ embeds: [embed] });
  },
};

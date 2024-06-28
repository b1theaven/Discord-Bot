const lang = require('../../language')
const { MessageEmbed } = require("discord.js")
module.exports = {
  name: 'kick',
  description: "Kick member",
  permission: "KICK_MEMBERS",
  options: [
    {
      name: 'member',
      description: "Users who will be kicked",
      type: "USER",
      required: true
    },
    {
      name: "reason",
      description: "Reason for being kicked",
      type: "STRING",
      required: false
    }
  ],
  execute: async(client, interaction, args) => {
    const members = interaction.options.getMember("member")
    let reasons = interaction.options.getString('reason') || "-"
    const userCannotKick = new MessageEmbed()
    .setColor("RED")
    .setDescription(lang(interaction.guild, "CANT_KICK"))
    const userKick = new MessageEmbed()
    .setColor("RANDOM")
    .setDescription(`_${lang(interaction.guild, "KICK")}_ **${members.user.tag}**\n\n__${lang(interaction.guild, "REASON")}__: **${reasons}**`)
    interaction.guild.members.cache.get(members.user.id).kick().then(async () => {
      interaction.reply({ embeds: [userKick]})
    }).catch(e => {
      return interaction.reply({ embeds: [userCannotKick], ephemeral: true})
    })
  }
}
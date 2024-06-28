const { Client, Interaction, MessageEmbed } = require("discord.js")

module.exports = {
  name: "serveravatar",
  description: "Get server avatar.",
  execute: async (client, interaction, args) => {
    try {
      const Embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(interaction.guild.name)
      .setImage(interaction.guild.iconURL({dynamic: true, size: 2048}))
      interaction.reply({ embeds: [Embed]})
    } catch(err) {
      console.log(err)
    }
  }
}
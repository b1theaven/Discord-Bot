const { Client, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Get users avatar.",
  options: [
    {
      name: "user",
      description: "User to display.",
      type: "USER",
      required: false
    }
  ],
  execute: async (client, interaction, args) => {
    try {
      const target = interaction.options.getMember('user') || interaction.member
      const Embed = new MessageEmbed()
      .setColor("RANDOM")
      .setImage(target.user.displayAvatarURL({dynamic: true, size: 2048}))
      .setTitle(`${target.user.tag}\'s avatar`)
      interaction.reply({embeds: [Embed] })
    } catch (err) {
      console.log("Something Went Wrong => ",err);
    }
  },
};
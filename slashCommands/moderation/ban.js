const lang = require('../../language');
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'ban',
  description: "Bans member",
  permission: "BAN_MEMBERS",
  options: [
    {
      name: 'member',
      description: "Users who will be banned",
      type: "USER",
      required: true
    },
    {
      name: "reason",
      description: "Reason for being banned",
      type: "STRING",
      required: false
    }
  ],
  execute: async (client, interaction, args) => {
    const members = interaction.options.getMember("member");
    let reasons = interaction.options.getString('reason') || "-";
    const userCannotBan = new MessageEmbed()
      .setColor("RED")
      .setDescription(lang(interaction.guild, "CANT_BAN"));

    const userBan = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`_${lang(interaction.guild, "BANNED")}_ **${members.user.tag}**\n\n__${lang(interaction.guild, "REASON")}__: **${reasons}**`);

    const notificationChannelID = '1251849567327096924'; // Ganti dengan ID channel yang diinginkan

    interaction.guild.members.cache.get(members.user.id).ban({ reason: reasons }).then(async () => {
      interaction.reply({ embeds: [userBan] });

      // Kirim pesan ke channel tertentu
      const notificationChannel = interaction.guild.channels.cache.get(notificationChannelID);
      if (notificationChannel) {
        const banNotification = new MessageEmbed()
          .setColor("RED")
          .setTitle("User Banned")
          .setDescription(`User **${members.user.tag}** has been banned.\n\n**Reason:** ${reasons}`)
          .setTimestamp();

        await notificationChannel.send({ embeds: [banNotification] });
      } else {
        console.log(`Channel with ID ${notificationChannelID} not found.`);
      }
    }).catch(e => {
      return interaction.reply({ embeds: [userCannotBan], ephemeral: true });
    });
  }
};

const { Client, Interaction, MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "hsrinfo",
  description: "Menampilkan informasi Honkai: Star Rail berdasarkan UID",
  options: [
    {
      name: "uid",
      description: "Masukkan UID pemain",
      type: "STRING",
      required: true,
    },
  ],

  execute: async (client, interaction, args) => {
    const uid = interaction.options.getString("uid");

    try {
      await interaction.deferReply();
      const hsr = await axios.get(
        `https://api.mihomo.me/sr_info_parsed/${uid}?lang=en`
      );
      const hsrData = hsr.data.player;
      if (!hsrData) {
        return interaction.editReply(
          "❌ UID tidak ditemukan atau data tidak tersedia."
        );
      }

      // Embed untuk informasi pemain
      const embed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(
          `${hsrData.nickname}`,
          `https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${hsrData.avatar.icon}`
        )
        .setTitle(`${hsrData.signature}`)
        .setThumbnail(
          `https://raw.githubusercontent.com/Mar-7th/StarRailRes/refs/heads/master/${hsrData.avatar.icon}`
        )
        .addField("UID", `${hsrData.uid}`, true)
        .addField(
          "Total Achievement",
          `${hsrData.space_info.achievement_count}`,
          true
        )
        .addField("Trailblaze Level", `${hsrData.level}`, true)
        .addField("World Level", `${hsrData.world_level}`, true)
        .addField("Total Friend", `${hsrData.friend_count}`, true)
        .addField("Total Music", `${hsrData.space_info.music_count}`, true)
        .addField("Total Relic", `${hsrData.space_info.relic_count}`, true)
        .addField(
          "Total Light Cone",
          `${hsrData.space_info.light_cone_count}`,
          true
        )
        .addField("Total Book", `${hsrData.space_info.book_count}`, true)
        .setFooter("Dah gini aja Developernya malas");

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      return interaction.editReply(
        "❌ Terjadi kesalahan saat mengambil data. Periksa UID atau coba lagi nanti."
      );
    }
  },
};

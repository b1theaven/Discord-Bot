const vipSchema = require("../../models/customrole");
const {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  name: "customrole-edit",
  description: "Edit custom role",
  options: [
    {
      name: "nama",
      description: "Nama baru role",
      required: true,
      type: "STRING",
    },
    {
      name: "color",
      description: "Warna baru",
      required: false,
      type: "STRING",
    },
  ],
  execute: async (client, interaction, args) => {
    const vipUser = await vipSchema.findOne({ user: interaction.user.id });
    if (!vipUser)
      return interaction.reply({
        content: "Kamu tidak mempunyai custom roles, buat terlebih dahulu",
        ephemeral: true,
      });
    const name = await interaction.options.getString("nama");
    if (name.length > 28)
      return interaction.reply({
        content: "Max character hanya 28",
        ephemeral: true,
      });
    const color = await interaction.options.getString("color");

    const roles = await interaction.guild.roles.cache.get(vipUser.roles);

    try {
      await roles.setName(name);
      await roles.setColor(color || roles.hexColor);
      vipUser.rolesColor = color || vipUser.rolesColor;
      await vipUser.save();
      await interaction.reply({
        content: `Role berhasil diubah menjadi ${roles} dengan warna ${
          roles.hexColor ? roles.hexColor : vipUser.rolesColor
        }`,
      });
    } catch (e) {
      return interaction.reply({
        content: `Terjadi kesalahan: \`\`\`${e.message}\`\`\``,
      });
    }
  },
};

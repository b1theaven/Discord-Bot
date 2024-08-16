const { MessageEmbed } = require('discord.js')
const confessSchema = require('../../models/confession')
module.exports = {
    name: "confession-remove",
    description: "Menghapus confession server",
  execute: async(client, interaction, args) => {
    
    const data = await confessSchema.findOne({ guild: interaction.guild.id })
    if(!data) {
      return interaction.reply({ content: ":x: Tidak dapat menemukan data confession", ephemeral: true})
    }
    
    await confessSchema.deleteMany({
      guild: interaction.guild.id
    })
    await interaction.reply({ content: "✅ Confession berhasil di hapus", ephemeral: true})
  }
}
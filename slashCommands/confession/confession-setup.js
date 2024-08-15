const { MessageEmbed } = require('discord.js')
const confessSchema = require('../../models/confession')
module.exports = {
    name: "confession-setup",
    description: "Confess setup",
    options: [ 
        {
        name: 'channel',
        type: "CHANNEL",
        description: "Channel untuk mengirim pesan anomim",
        required: true
    },
],
  execute: async(client, interaction, args) => {
    
    const channel = interaction.options.getChannel('channel')
    
    const data = await confessSchema.findOne({ guild: interaction.guild.id })
    if(data) {
      return interaction.reply({ content: ":x: Tidak bisa! confession sudah ada", ephemeral: true})
    }
    
    await confessSchema.create({
      guild: interaction.guild.id,
      channel: channel.id,
      confession: 0
    })
    await interaction.reply({ content: "✅ Confession berhasil di setup", ephemeral: true})
  }
}
const { MessageEmbed } = require('discord.js')
const confessSchema = require('../../models/confessionUser')
module.exports = {
    name: "confession-blacklist",
    description: "Blacklist user",
    options: [ 
        {
        name: 'id',
        type: "STRING",
        description: "ID bisa di temukan di bagian embed footer berawalan dengan 'Srv'",
        required: true
    },
],
  execute: async(client, interaction, args) => {
    
    const id = interaction.options.getString('id')
    
    const data = await confessSchema.findOne({ confessionID: id })
    if(!data) {
      return interaction.reply({ content: `:x: Tidak dapat menemukan data id **${id}**`, ephemeral: true})
    }
      
      if(data.blacklist === "blacklist") {
        return interaction.reply({ content: ":x: User ini sudah diblacklist"})
    }
    
    await confessSchema.findOneAndUpdate({
      blacklist: 'blacklist'
    })
    await interaction.reply({ content: `✅ Berhasil memblacklist user dengan id **${id}**`, ephemeral: true})
  }
}
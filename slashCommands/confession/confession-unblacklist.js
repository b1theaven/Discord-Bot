const { MessageEmbed } = require('discord.js')
const confessSchema = require('../../models/confessionUser')
module.exports = {
    name: "confession-unblacklist",
    description: "Menghapus blacklist user",
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
      return interaction.reply({ content: `:x: Tidak dapat menemukan data id **${id}**`})
    }
      if(data.blacklist === "unblacklist") {
        return interaction.reply({ content: ":x: User ini tidak terdaftar dalam blacklist"})
    }
    
    await confessSchema.findOneAndUpdate({
      blacklist: 'unblacklist'
    })
    await interaction.reply({ content: `✅ Berhasil menghapus blacklist user dengan id **${id}**`, ephemeral: true})
  }
}
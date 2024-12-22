const { MessageEmbed } = require('discord.js')
const starboardSchema = require('../../models/starboard')


module.exports = {
  name: 'starboard-remove',
  description: "Remove the starboard system",
  permission: "MANAGE_SERVER",
  execute: async(client, interaction, args) => {
    const data = await starboardSchema.findOne({ guild: interaction.guild.id })
    
    if(!data) {
      await interaction.reply({ content: ":x: Couldn't find starboard data in this server, please run the command \`/starboard-setup\` to setup the starboard system. Thank you", ephemeral: true})
      
    } else {
      await starboardSchema.deleteOne({ guild: interaction.guild.id })
      const embed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription("<:check:770913043974586400> I have removed the starboard system in this server. Thank you")
      await interaction.reply({ embeds: [embed], ephemeral: true})
    }
  }
}
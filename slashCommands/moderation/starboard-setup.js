const { MessageEmbed } = require('discord.js')
const starboardSchema = require('../../models/starboard')


module.exports = {
  name: 'starboard-setup',
  description: "Setup the starboard system",
  permission: "MANAGE_SERVER",
  options: [
    {
      name: 'count',
      description: "Number of stars a message needs to be added",
      required: true,
      type: "NUMBER"
    },
    {
      name: "channel",
      description: "The channel to send starred messages",
      type: "CHANNEL",
      required: true
    }
  ],
  execute: async(client, interaction, args) => {
    const channelid = interaction.options.getChannel('channel')
    if(channelid.type === "GUILD_VOICE") return interaction.reply({ content:"Please provide a valid text channel", ephemeral: true });
    if(channelid.type === "GUILD_CATEGORY") return interaction.reply({ content:"Please provide a valid text channel", ephemeral: true });
    
    const data = await starboardSchema.findOne({ guild: interaction.guild.id })
    
    if(data) {
      await interaction.reply({ content: `<:ingfo:801315195858321468> This server has already setup the starboard system, A messages get **⭐ ${data.count}** and channel will be sent the message <#${data.channel}>`, ephemeral: true})
    } else {
      var number = interaction.options.getNumber("count")
      
      await starboardSchema.create({ 
        
        guild: interaction.guild.id,
        channel: channelid.id,
        count: number
      
      })
      
      const embed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription(`<:check:770913043974586400> I have setup the starboard system, once a message gets **${number}** ⭐'s. It will be sent in ${channelid}`)
      
      await interaction.reply({ embeds: [embed], ephemeral: true})
      
    }
    
  }
}
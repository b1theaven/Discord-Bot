const discord = require("discord.js")
const voiceSchema = require("../../models/voiceSchema")

module.exports = {
    name: "jointocreate-setup",
    description: "Serval",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "voice-channel",
            description: "Voice channel",
            type: "CHANNEL",
            channel_types: [2],
            required: true
        },
        {
            name: "category",
            description: "Category channel",
            type: "CHANNEL",
            channel_types: [4],
            required: true
        }
    ],
    execute: async(client, interaction, args) => {
        const categoryChannel = interaction.options.getChannel("category")
        const voiceChannel = interaction.options.getChannel("voice-channel")
        const voiceData = await voiceSchema.findOne({ guild: interaction.guild.id })
        
        if(voiceData) {
          return interaction.reply({ content: "This feature already active", ephemeral: true})
      } else {
          await voiceSchema.create({
              guild: interaction.guild.id,
               voice: voiceChannel.id,
              category: categoryChannel.id,
              userLimit: 0
          })
          await interaction.reply({ content: `The voice create has been setup, voice channel <#${voiceChannel.id}> category <#${categoryChannel.id}>`,ephemeral: true})
      }
    }
}
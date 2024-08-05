const reactionRole = require("../../models/reactionrole")
const { MessageEmbed } = require("discord.js")

module.exports = {
  name: "reactionroles-remove",
  description: "Remove a reaction role",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: 'message-id',
      description: 'Message id to delete',
      required: true,
      type: "STRING"
    },
  ],
  execute: async(client, interaction, args) => {
    
    const { options, guild, channel } = interaction
    let err;
    const messageId = await channel.messages.fetch(options.getString("message-id")).catch(e => {

       err = e
       console.log(e)
     })
     
     
     if(err) return interaction.reply({ content: `Got an error, make sure you get a message id from ${channel}`})
    const data = await reactionRole.findOne({ guild: interaction.guild.id})
    if(!data) return interaction.reply({ content: `:x: | It looks like this server didn't setup any reaction role, please type /reactionroles-add to setup the reaction roles.`, ephemeral: true})
     
     await messageId.reactions.removeAll()
     await reactionRole.deleteMany({ guild: interaction.guild.id })
     await interaction.reply({ content: `✅ | I have deleted reaction role in this server, have a good day`, ephemeral: true})
  }
}
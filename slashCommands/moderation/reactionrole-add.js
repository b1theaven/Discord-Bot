const reactionRole = require("../../models/reactionrole")
const { MessageEmbed } = require("discord.js")



module.exports = {
  name: "reactionroles-add",
  description: "Add a role with an emoji",
  permission: "ADMINISTRATOR",
  options: [ 
  {
    name: "message-id",
    description: "The message id to react",
    type: "STRING",
    required: true
    }, {

    name: "emoji",
    description: "The emoji to react",
    type: "STRING",
    required: true
  }, { 
    name: "role",
    description: "Role want to give",
    type: "ROLE",
    required: true

     }
    ],
   execute: async(client, interaction, args) => {


     const { guild, options, channel } = interaction
     
     let err;
     const emoji = options.getString("emoji")
     const messageId = await channel.messages.fetch(options.getString("message-id")).catch(e => {

       err = e
       console.log(e)
     })
     
     
     if(err) return interaction.reply({ content: `Got an error, make sure you get a message id from ${channel}`})
     
     const reactionData = await reactionRole.findOne({ guild: guild.id, message: messageId.id, emoji: emoji})
     
     
     if(reactionData) {

      return interaction.reply({ content: `This server already setup a reaction roles using ${emoji} on this message`})
    } else {


      const role = options.getRole("role")
      await reactionRole.create({
        guild: guild.id,
        message: messageId.id,
        emoji: emoji,
        role: role.id
      
      })
      
      const embed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription(`✅ | Added a role reaction to ${messageId.url} with ${emoji} and the role ${role}`)
      await messageId.react(emoji)
      await interaction.reply({ embeds: [embed], ephemeral: true})
    }

   }

}
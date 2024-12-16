const { MessageEmbed } = require("discord.js")

module.exports = {
  name: "lookingforgroup",
  description: "Look a playing group",
  options: [
    {
      name: "game-name",
      description: "Example: /lookingforgroup game-name: valorant",
      required: true,
      type: "STRING"
   }
  ],
  execute: async(client, interaction, args) => {
     var game = interaction.options.getString("game-name")
     var member = await interaction.guild.members.fetch()
     
     var group = []
     await member.forEach(async act => {
      if(!act.presence || !act.presence.activities[0]) return
       var current = await act.presence.activities[0].name
       
       if(current.toLowerCase() === game.toLowerCase()) group.push({ user: act.id, game: current, length: act.size})
       else return
       
  })
    group = group.slice(0, 2000)
    
    const embed = new MessageEmbed()
    .setColor("BLUE")
    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
    
    var string;
    await group.forEach(async value => {
      const members = await interaction.guild.members.cache.get(value.user)
      string += `(${value.user}) **${members.user.username}**: Is on **${value.game}**\n`
  })
    
    if(string) {
     string = string.replace("undefined", " ")
      embed.setTitle(`Members Playing ${game}`)
      embed.setDescription(string)
    } else {
      return interaction.reply({ content: "❓ No one members playing that game", ephemeral: true})
    }
    
    await interaction.reply({ embeds: [embed]})
 }
} 
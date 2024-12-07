const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args) => {
  if(!message.member.permissions.has("KICK_MEMBERS")) return message.reply("**NO PERMISSION**")
  let member = message.mentions.members.first();
  if(!member) return message.channel.send("Mention a user")
  if(!member.kickable) return message.channel.send("I can't kick this person")
  let reason = args[1]
  if(!reason) reason = "NONE"
  member.kick().then((member) => {
    const embed = new MessageEmbed()
    .setAuthor("Kicked", member.user.displayAvatarURL({dynamic: true}))
    .setColor("BLUE")
    .addField("Kicked user", `\`${member.displayName}\``)
    .addField("Reason", `\`${reason}\``)
    .addField("Kicked By", `\`${message.author.username}\``)
    .setFooter(`Bye ${member.displayName}`)
    .setTimestamp()
    message.channel.send(embed)
  })
}
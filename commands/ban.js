const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args) => {
  if(!message.member.permissions.has("BAN_MEMBERS")) return message.reply("**NO PERMISSION**")
  let member = message.mentions.members.first();
  if(!member) return message.channel.send("Mention a user")
  if(!member.banable) return message.channel.send("I can't ban this person")
  let reason = args[1]
  if(!reason) reason = "NONE"
  member.ban().then((member) => {
    const embed = new MessageEmbed()
    .setAuthor("Banned", member.displayAvatarURL({dynamic: true}))
    .setColor("RED")
    .addField("Banned user", `\`${member.displayName}\``)
    .addField("Reason", `\`${reason}\``)
    .addField("Banned By", `\`${message.author.username}\``)
    .setFooter(`Bye ${member.displayName}`)
    .setTimestamp()
    message.channel.send(embed)
  })
}
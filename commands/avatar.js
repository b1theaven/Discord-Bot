const { MessageEmbed } = require('discord.js')
module.exports = {
  name: 'avatar', 
  aliases: ['av'], 
  run: async (client, message, args) => {
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.join(" ") || x.user.username === args[0]) || message.guild.members.cache.find(m => m.user.tag === args.slice(0).join(" ")) || message.guild.members.cache.find(m => m.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(m => m.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()) || message.member;
  let embed = new MessageEmbed()
  .setTitle(`Avatar ${member.user.username}`)
   .setColor("BLUE")
  .setImage(member.user.displayAvatarURL({size: 4096, dynamic: true}))
  .setTimestamp()
  .setFooter(`Request ${message.author.tag}`)
  message.channel.send({ embeds: [embed]})
}
}

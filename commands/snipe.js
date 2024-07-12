const { MessageEmbed } = require('discord.js')
module.exports = {
name: 'snipe',
description: 'D',

 run: async (client, message, args) => {
let embedroles = new MessageEmbed()
.setDescription("Kamu harus memiliki role <@&1152818399366365215> terlebih dahulu")
.setColor("ORANGE")
let roles = message.member.roles.cache.has("1152818399366365215")
if(!roles) return message.channel.send({embeds: [embedroles]})
 const msg = client.snipes.get(message.channel.id);
let embed = new MessageEmbed()
.setDescription("Tidak ada pesan yang di hapus di channel " + message.channel.name)
.setColor("RED")
 if(!msg) return message.channel.send({ embeds: [embed]})
   
const embed2 = new MessageEmbed()
.setAuthor(msg.author.globalName, msg.author.displayAvatarURL())
.addField("Author", msg.author.username, true)
.addField("Message", msg.content, true)
.setColor('BLUE')
//.setImage(msg.attachments ? msg.attachments.url : "https://cdn.discordapp.com/attachments/881207789547061258/1260826377041608814/IMG_0897.jpg?ex=6690bb91&is=668f6a11&hm=adf42bf196d595ab53c85457f59e87a36f60b8dbf7590a8cfa5c5f8eb890e5be&")
message.channel.send(embed)
if(msg.embeds) return message.channel.send({ embeds: [embed2]})
  }
}
const Discord = require('discord.js')
const request = require("node-superfetch")

module.exports = {
  name: "Google", 
  description: "Search Google",
  run: async (client, message, args) => {
    let googlekey = ""
    let csx = ""
    let query = args.join(" ")
    let result;
    let embedroles = new Discord.MessageEmbed()
.setDescription("Kamu harus memiliki role <@&1152818715470082058> terlebih dahulu")
.setColor("ORANGE")
let roles = message.member.roles.cache.has("1152818715470082058")
if(!roles) return message.channel.send({embeds: [embedroles]})
    if(!query) return message.channel.send({ content: "Masukan kata kunci"})
    
    let href = await search(query)
    if(!href) return message.channel.send({content:"Unknown search"})
    
    const embed = new Discord.MessageEmbed()
    .setTitle(href.title)
    .setDescription(href.snippet)
    .setURL(href.link)
    .setImage(href.pagemap ? href.pagemap.cse_thumbnail[0].src : null)
    .setColor("GOLD")
    .setFooter(`Request ${message.author.tag}`)
    .setTimestamp()
    return message.channel.send({embeds: [embed]})
    async function search(query) {
      const { body } = await request.get("https://www.googleapis.com/customsearch/v1").query({
        key: googlekey, cx: csx, safe: "off", q: query
      });
      if(!body.items) return null;
      return body.items[0]
    }
  }
}

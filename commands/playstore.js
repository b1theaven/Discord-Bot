const {stripIndents} = require("common-tags")
const playstore = require('google-play-scraper')
const html2md = require("html2markdown")
const { progressBar } = require("../bar")
const { MessageEmbed } = require('discord.js')
const lang = require('../language')

module.exports = {
  aliases: ['ps'],
  cooldown: 5,
  run: async (client, message, args) => {
  
  let msg = message
  if(!args[0]) return message.channel.send(lang(msg.guild, "SEARCH_SOMETHING"))
  playstore.search({
    term: args.join(" "),
    num: 1 }).then(pl => { 
    let store;
    store = JSON.parse(JSON.stringify(pl[0]))
    let embed = new MessageEmbed()
    .setColor("GREEN")
    .setAuthor(store.title, store.icon)
    .setDescription(stripIndents`
    ${shorten(html2md(store.summary))}
    
**${lang(msg.guild, "INFORMATION")}**

${lang(msg.guild, "TT_NAME")}: **${store.title}**
${lang(msg.guild, "DEVELOPERS")}: **${store.developer}** 
Rated: **${store.scoreText}**
Link: **${store.url}**`)
    .setFooter("Play Store")
    .setTimestamp()
    message.channel.send({embeds: [embed]})
  })
    .catch(e => msg.channel.send({ content: html2md(e.message)}))
  }
}

function shorten(str) {
  if (str.length > 1000) {
      return str.substring(0, 1001) + '...';
  } else {
      return str;
  }
}
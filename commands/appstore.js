const {stripIndents} = require("common-tags")
const appstore = require('app-store-scraper')
const html2md = require("html2markdown")
const { progressBar } = require("../bar")
const { MessageEmbed } = require('discord.js')
const lang = require('../language')

module.exports = {
  aliases: ['as'],
  cooldown: 5,
  run: async (client, message, args) => {
  
  let msg = message
  if(!args[0]) return message.channel.send(lang(msg.guild, "SEARCH_SOMETHING"))
  appstore.search({
    term: args.join(" "),
    num: 1 }).then(pl => { 
    let store;
    store = JSON.parse(JSON.stringify(pl[0]))
    let embed = new MessageEmbed()
    .setColor("GREEN")
    .setAuthor(store.title, store.icon)
    .setDescription(stripIndents`
    ${shorten(html2md(store.description))}

    
**${lang(msg.guild, "INFORMATION")}**

${lang(msg.guild, "TT_NAME")}: **${store.title}**
${lang(msg.guild, "DEVELOPERS")}: **${store.developer}** 
Rated: **${store.score.toFixed(1) ? store.score.toFixed(1) : "Unknown"}**
Link: **${store.url}**`)
    .setFooter("App Store")
    .setTimestamp()
    .setImage(`${store.screenshots[1] ? store.screenshots[3] : "https://img.freepik.com/premium-vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-web-site-mobile-app_87543-18055.jpg?w=826"}`)
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
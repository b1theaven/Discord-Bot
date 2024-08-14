const {stripIndents} = require("common-tags")
const playstore = require('google-play-scraper')
const html2md = require("html2markdown")
const { progressBar } = require("../../bar")
const { MessageEmbed } = require('discord.js')
const lang = require('../../language')

module.exports = {
  name: "playstore",
  description: "Search an application by name",
  options: [
    {
      name: "search",
      description: "Please provide something to search",
      type: "STRING",
      required: true
    }
  ],
  execute: async (client, interaction, args) => {
  
    const [ query ] = args
    let msg = interaction
  //if(!args[0]) return message.channel.send(lang(msg.guild, "SEARCH_SOMETHING"))
  playstore.search({
    term: args,
    num: 1 }).then(pl => { 
    let store;
    store = JSON.parse(JSON.stringify(pl[0]))
    console.log(store)
    let embed = new MessageEmbed()
    .setColor("GREEN")
    .setAuthor(store.title, store.icon)
    .setDescription(`[${shorten(html2md(store.summary))}](${store.url})`)
    .setFooter("Play Store")
    .setTimestamp()
    .setImage("https://media.discordapp.net/attachments/726482147569041451/1264624769391919134/IMG_1056.jpg?ex=669e8d18&is=669d3b98&hm=eb5b37ed11689422d0b90cc39fc34118f9a3a0cca62e8a6542b9cbb9ab9bb92d&")
    .setThumbnail(store.icon)
    .addField("Name", store.title)
    .addField("Developer", store.developer)
    .addField("Rated", `${store.scoreText ? store.score.toFixed(1) : "Unknown"}`)
    .addField("Link", `[Click Here](${store.url})`)
    interaction.reply({embeds: [embed]})
  })
    .catch(e => msg.reply({ content: html2md(e.message)}))
  }
}

function shorten(str) {
  if (str.length > 1000) {
      return str.substring(0, 1001) + '...';
  } else {
      return str;
  }
}
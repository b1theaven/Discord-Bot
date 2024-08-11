const {stripIndents} = require("common-tags")
const appstore = require('app-store-scraper')
const html2md = require("html2markdown")
const { progressBar } = require("../../bar")
const { MessageEmbed } = require('discord.js')
const lang = require('../../language')

module.exports = {
  name: "appstore",
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
  if(!args[0]) return message.channel.send(lang(msg.guild, "SEARCH_SOMETHING"))
  appstore.search({
    term: args,
    num: 1 }).then(pl => { 
    let store;
    store = JSON.parse(JSON.stringify(pl[0]))
    console.log(store)
    const supportedDevice = store.supportedDevices.map(m => m)
    console.log(supportedDevice)
    console.log(store.score)
    let embed = new MessageEmbed()
    .setColor("GREEN")
    .setAuthor(store.title, store.icon)
    .setDescription(`[${shorten(html2md(store.description))}](${store.url})`)
    .setFooter("App Store")
    .setTimestamp()
    .setImage("https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg")
    .setThumbnail(store.icon)
    .addField("Name", store.title)
    .addField("Developer", store.developer)
    .addField("Rated", `${store.score.toFixed(1) ? store.score.toFixed(1) : "Unknown"}`)
    .addField("Link", `[Click Here](${store.url})`)
    .setImage(`${store.screenshots[1] ? store.screenshots[3] : "https://img.freepik.com/premium-vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-web-site-mobile-app_87543-18055.jpg?w=826"}`)
    interaction.reply({embeds: [embed]})
  })
    .catch(e => interaction.reply({ content: html2md(e.message), ephemeral: true}))
  }
}

function shorten(str) {
  if (str.length > 1000) {
      return str.substring(0, 1001) + '...';
  } else {
      return str;
  }
}


function messageLimit(str) {
  if (str.length > 1000) {
      return str.substring(0, 1001) + '...';
  } else {
      return str;
  }
}
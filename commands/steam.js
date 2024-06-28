const snekfetch = require("snekfetch")
const html2md = require("html2markdown")
const text = require("../util/string.js")
const { decode } = require("he")
const { MessageEmbed } = require("discord.js")
const {stripIndents} = require("common-tags")
const lang = require('../language')
module.exports = {
  name: "steam", 
  run: async (client, msg, args) => {
    let query = args.join(" ")
    if(!query) return msg.channel.send(lang(msg.guild, "SEARCH_SOMETHING"))
    
    const search = await snekfetch
    .get('https://store.steampowered.com/api/storesearch')
    .query({
      cc: 'us',
      l: 'en',
      term: query
    })
    if(!search.body.items.length) return msg.channel.send(`${lang(msg.guild, "SEARCH_NOT_FOUND")} \`${query}\``)
    
    const {
      id,
      tiny_image,
    } = search.body.items[0];
    const {
      body 
    } = await snekfetch
    .get("https://store.steampowered.com/api/appdetails")
    .query({
      appids: id
    })
    const {
      data
    } = body[id.toString()]
    const current = data.price_overview ? `${data.price_overview.final / 100}` : lang(msg.guild, "FREE")
    const ori = data.price_overview ? `${data.price_overview.initial / 100}` : lang(msg.guild, "FREE")
    const price = current === ori ? current : `$~~${ori}~~ $${current}`
    const logo = { windows: "<:windows:809849945490063401>", mac: "<:mac:809850196912898109>", linux: "<:linux:809850337955414026>" }
    const requirements = { windows: "pc_requirements", mac: "mac_requirements", linux: "linux_requirements" }
    const platforms = []
    if(data.platforms) {
      if(data.platforms.windows) platforms.push("Windows")
      if(data.platforms.mac) platforms.push("Mac")
      if(data.platforms.linux) platforms.push("Linux")
    }
    const system = Object.entries(data.platforms).filter(([systems, has]) => has)
    .map(([systems]) => {
     return `${logo[systems]} ${decode(html2md(data[requirements[systems]].minimum)).split("* **Additional Notes:")[0]}`
    })
    const steamEmbed = new MessageEmbed()
    .setColor("YELLOW")
    .setAuthor("Steam", "https://i.imgur.com/xxr2UBZ.png", "https://store.steampowered.com/")
    .setImage(tiny_image)
    .setTitle(data.name)
    .setURL(`https://store.steampowered.com/app/${data.steam_appid}`)
    .setThumbnail(tiny_image)
    .setDescription(stripIndents`\`•\` ${lang(msg.guild, "PRICE")}: **${price}**
    \`•\` Metascore: **${data.metacritic ? data.metacritic.score : "???"}**
    \`•\` ${lang(msg.guild, "RECOMMENDATIONS")}: **${data.recommendations ? data.recommendations.total : "???"}**
    \`•\` Platforms: **${platforms.join(", ") || "None"}**
    \`•\` ${lang(msg.guild, "RELEASE_DATE")}: **${data.release_date ? data.release_date.date : "???"}**
    \`•\` ${lang(msg.guild, "SUPPORT_LANGUAGES")}: ${text.truncate(html2md(data.supported_languages), 997)}
    \`•\` ${lang(msg.guild, "DLC_COUNT")}: **${data.dlc ? data.dlc.length : 0}**
    \`•\` ${lang(msg.guild, "DEVELOPERS")}: **${data.developers ? data.developers.join(", ") || "???" : "???"}**
    \`•\` ${lang(msg.guild, "PUBLISHERS")}: **${data.publishers ? data.publishers.join(", ") || "???" : "???"}**
    \`•\` ${lang(msg.guild, "SYSTEM_REQUIREMENTS")}:\n**${system[0]}**`)
    .setTimestamp()
    msg.channel.send({ embeds: [steamEmbed] })
  }
}
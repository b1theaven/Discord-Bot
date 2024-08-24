const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js')
const axios = require('axios')
const { shorten } = require("tinyurl")
const urlApi = "PUT_YOUR_API_HERE"
const { alldown } = require("nayan-media-downloader")
const wait = require("node:timers/promises").setTimeout
module.exports = {
  name: "downloader",
  description: "Download video from instagram/youtube/tiktok",
  run: async(client, message, args) => {
    const url = args.join(" ")
    if(!url) return message.reply({ content: "Please insert an url"})
    const data = await alldown(url)
    //console.log(data)
    if(data.status === false) return message.reply({ content: `**${data.error}** [ \`\`\`${data.msg}\`\`\` ]`, ephemeral: true})
    const lowUrl = await shorten(data.data.low)
    const hdUrl = await shorten(data.data.high)
    const lowButton = new MessageButton()
    .setLabel("LOW Video")
    .setStyle("LINK")
    .setURL(lowUrl)
    const hdButton = new MessageButton()
    .setLabel("HD Video")
    .setStyle("LINK")
    .setURL(hdUrl)
    const row = new MessageActionRow().addComponents(lowButton, hdButton)
    const embed = new MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
    .addField("Title", data.data.title || "Unknown")
    .addField("HD Video", `[Click Here](${hdUrl})`)
    .addField("LOW Video", `[Click Here](${lowUrl})`)
    .setTimestamp()
    await message.reply({ embeds: [embed], components: [row]})
  }
}
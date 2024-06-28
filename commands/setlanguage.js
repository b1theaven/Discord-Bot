const languageSchema = require('../models/language')
const { languages } = require('../lang.json')
const { setLanguage } = require('../language')
const lang = require("../language")
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js")
const { loadLanguages } = require("../language")
const wait = require("util").promisify(setTimeout)
module.exports = {
  name: 'setlanguage',
  aliases: ["setlang", "lang"],
  run: async (client, msg, args) => {
    if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send({ content: "**"+lang(msg.guild, "MISSING_PERMISSION")+"**\n\n"+lang(msg.guild, "ADMINISTRATOR_PERMISSION") })
    const message = msg
    const guild = msg.guild
    const data = await languageSchema.findOne({ _id: guild.id})
    
    let menu = new MessageSelectMenu()
    .setPlaceholder("Language available: Click here")
    .setCustomId("select")
    .addOptions([
      {
        label: "English",
        description: "English Language",
        value: "en_lang"
      },
      {
        label: "Indonesian",
        description: "Indonesian Language",
        value: "id_lang"
      },
      {
        label: "Japan",
        description: "Japan Language",
        value: "jp_lang"
      }
      ])
    
    let row = new MessageActionRow().addComponents(menu)
    
    
    let embed = new MessageEmbed()
    .setColor("YELLOW")
    .setDescription(lang(msg.guild, "SELECT_LANGUAGE"))
    .setTimestamp()
    
     msg.channel.send({ embeds: [embed], components: [row]}).then(async (m) => {
       const collector = m.createMessageComponentCollector({ componentType: "SELECT_MENU", time: 120 * 1000})
       
       collector.on("collect", async (i) => {
         if(i.user.id) {
           if(i.values[0] === "en_lang") {
             i.deferUpdate()
             menu.setPlaceholder("Set to English")
             row = new MessageActionRow().addComponents(menu)
             if(!data) {
               const newData = await languageSchema.create({
                 _id: msg.guild.id,
                 language: "en"
               })
               newData.save()
             } else {
               await languageSchema.findOneAndUpdate(
                 {
                   _id: msg.guild.id
                 },
                 {
                   language: "en"
                 },
                 {
                   upsert: true
                 }
                 )
             }
             setLanguage(guild, "en")
             return m.edit({ embeds: [embed], components: [row]})
             wait(2000)
             loadLanguages(client)
           } else if(i.values[0] === "id_lang") {
             i.deferUpdate()
             menu.setPlaceholder("Set to Indonesian")
             row = new MessageActionRow().addComponents(menu)
             if(!data) {
               const newData = await languageSchema.create({
                 _id: msg.guild.id,
                 language: "id"
               })
               newData.save()
             } else {
               await languageSchema.findOneAndUpdate(
                 {
                   _id: msg.guild.id
                 },
                 {
                   language: "id"
                 },
                 {
                   upsert: true
                 }
                 )
             }
             setLanguage(guild, "id")
             return m.edit({ embeds: [embed], components: [row]})
             wait(2000)
             loadLanguages(client)
           } else if(i.values[0] === "jp_lang") {
             i.deferUpdate()
             menu.setPlaceholder("Set to Japan")
             row = new MessageActionRow().addComponents(menu)
             if(!data) {
               const newData = await languageSchema.create({
                 _id: msg.guild.id,
                 language: "jp"
               })
               newData.save()
             } else {
               await languageSchema.findOneAndUpdate(
                 {
                   _id: msg.guild.id
                 },
                 {
                   language: "jp"
                 },
                 {
                   upsert: true
                 }
                 )
             }
             setLanguage(guild, "jp")
             return m.edit({ embeds: [embed], components: [row]})
             wait(2000)
             loadLanguages(client)
           }
         } else {
           i.deferUpdate()
         }
       })
       collector.on("end", async (i) => {
           try {
             embed.setDescription(lang(msg.guild, "TIME_UP"))
             menu.setPlaceholder("Commands expired")
             menu.setDisabled(true)
             row = new MessageActionRow().addComponents(menu)
             m.edit({ embeds: [embed], components: [row]})
           } catch(e) {
             return
           }
       })
     })
  }
}
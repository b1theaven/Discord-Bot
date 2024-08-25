const { MessageEmbed, MessageSelectMenu, MessageButton, MessageActionRow } = require('discord.js')
const axios = require('axios')
const wait = require("node:timers/promises").setTimeout
module.exports = {
  name: "pinterest",
  description: "Search an image from pinterest by name",
  run: async(client, message, args) => {
        const query = args.join(" ")
        if(!query) return message.reply({ content: "Provide something to search"})
        const response = await axios.get('https://apidl.asepharyana.my.id/api/search/pinterest?query='+encodeURIComponent(query))
        const responseData = response.data
        if(!response) return message.reply({ content: `There's no result from \`\`\`${query}\`\`\`\``})
        if(responseData.length === 0) return message.reply({ content: `There's no result from \`\`\`${query}\`\`\``, ephemeral: true})
        const select = new MessageSelectMenu()
        .setCustomId("pinterest-select")
        .setPlaceholder(`${responseData.length} matching images`)
        .addOptions([responseData.map(e => {
            return { label: query, description: e, value: e, emoji: "<:picture:1275764069898391593>"}
        })])
        const selectRow = new MessageActionRow().addComponents(select)
        const msg = await message.reply({ content: `I found **${responseData.length}** matching images`, components: [selectRow]})
        const filter = i => i.user.id === message.author.id    
        const collector = msg.createMessageComponentCollector({ componentType: "SELECT_MENU", filter, time: 120 * 1000})
        
        collector.on("collect", async i => {
          if(i.customId === "pinterest-select") {
            const value = i.values[0]
            const removeButton = new MessageButton()
            .setCustomId('remove-btn')
            .setEmoji("1274669483960569909")
            .setLabel("Delete")
            .setStyle("DANGER")
            const downloadButton = new MessageButton()
            .setURL(value)
            .setEmoji("1275767418454671401")
            .setLabel("Download")
            .setStyle("LINK")
            const back = new MessageButton()
            .setCustomId('back-btn')
            .setEmoji("◀")
            .setLabel("Back")
            .setStyle("PRIMARY")
            const rowButton = new MessageActionRow().addComponents(downloadButton, removeButton)
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .addField("Query", query)
            .setDescription(`Here's your picture from **${query}**'s`)
            .setImage(value)
            .setTimestamp()
            await i.update({ embeds: [embed], components: [selectRow, rowButton]})
            const collector2 = msg.createMessageComponentCollector({ componentType: "BUTTON", filter, time: 60*1000})
            collector2.on("collect", async i =>{
              if(i.customId === "remove-btn") {
                await msg.delete()
              }
            })
            collector2.on("end", async i => {
              removeButton.setDisabled(true)
              downloadButton.setDisabled(true)
              select.setDisabled(true)
              await msg.edit({ components: [selectRow, rowButton]})
           })
          }
        })
      collector.on("end", async i => {
        select.setDisabled(true)
        await msg.edit({ components: [selectRow]})
      })
      
    }
}
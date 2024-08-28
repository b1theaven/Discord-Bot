const { MessageEmbed, MessageSelectMenu, MessageButton, MessageActionRow } = require('discord.js')
const axios = require('axios')
const wait = require("node:timers/promises").setTimeout
module.exports = {
  name: "pinterest",
  description: "Search an image from pinterest by name",
  options: [
    {
      name: "query",
      description: "Please provide something to search",
      type: "STRING",
      required: true
    }
  ],
    execute: async(client, interaction, args) => {
        const query = interaction.options.getString("query")
        const response = await axios.get('PUT_YOUR_API_HERE'+encodeURIComponent(query))
        const responseData = response.data
        if(!response) return interaction.reply({ content: `There's no result from \`\`\`${query}\`\`\`\``})
        if(responseData.length === 0) return interaction.reply({ content: `There's no result from \`\`\`${query}\`\`\``, ephemeral: true})
        console.log(responseData.map(e => e))
        const select = new MessageSelectMenu()
        .setCustomId("pinterest-select")
        .setPlaceholder(`${responseData.length} matching images`)
        .addOptions([responseData.map(e => {
            return { label: query, description: e, value: e, emoji: "<:picture:1275764069898391593>"}
        })])
        const selectRow = new MessageActionRow().addComponents(select)
        await interaction.deferReply()
        await wait(1000)
        const msg = await interaction.editReply({ content: `I found **${responseData.length}** matching images`, components: [selectRow]})
        const filter = i => i.user.id === interaction.user.id    
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
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
            .addField("Query", query)
            .setDescription(`Here's your picture from **${query}**'s`)
            .setImage(value)
            .setTimestamp()
            await i.update({ embeds: [embed], components: [selectRow, rowButton]})
            const collector2 = msg.createMessageComponentCollector({ componentType: "BUTTON", filter, time: 60*1000})
            collector2.on("collect", async i =>{
              if(i.customId === "remove-btn") {
                await interaction.deleteReply()
              }
            })
            collector2.on("end", async i => {
              removeButton.setDisabled(true)
              downloadButton.setDisabled(true)
              select.setDisabled(true)
              await interaction.editReply({ components: [selectRow, rowButton]})
           })
          }
        })
      collector.on("end", async i => {
        select.setDisabled(true)
        await interaction.editReply({ components: [selectRow]})
      })
      
    }
}
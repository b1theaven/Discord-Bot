const Discord = require("discord.js")
const { MessageButton, MessageActionRow } = require("discord.js")
const lang = require("../language")
module.exports = {
  name: "emojilist",
  cooldown: 3,
  run: async (client, message, args) => {
    let i0 = 0
    let i1 = 10
    let page = 1
    
    const emojis = message.guild.emojis.cache.map(opt => opt).map((opt, i) => {
      if(opt.animated === true) return `${i+1} - ${opt} \`<a:${opt.name}:${opt.id}>\``
      if(opt.animated === false) return `${i+1} - ${opt} \`<:${opt.name}:${opt.id}>\``
    }).slice(0, 10).join("\n")
    if (!emojis.length) return message.reply({ content: lang(message.guild, "NO_EMOJI")});
    const pages = (page) => {
     return new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId("previous_button")
        .setEmoji("⬅️")
        .setDisabled(page < 2)
        .setStyle("PRIMARY"),
        new MessageButton()
        .setCustomId("next_button")
        .setEmoji("➡️")
        .setDisabled(!(page < (message.guild.emojis.cache.size / 10)))
        .setStyle("PRIMARY")
      )
    }
    let dis = new MessageActionRow().addComponents(
      new MessageButton()
      .setCustomId("previous_button")
      .setEmoji("⬅️")
      .setDisabled(true)
      .setStyle("PRIMARY"),
      new MessageButton()
      .setCustomId("next_button")
      .setEmoji("➡️")
      .setDisabled(true)
      .setStyle("PRIMARY")
      )
    const embed = new Discord.MessageEmbed()
    .setColor("PURPLE")
    .setDescription(emojis)
    .setFooter(`Page ${page}/${Math.ceil(message.guild.emojis.cache.size / 10)}`)
    if(emojis.length < 10) {
      return message.channel.send({ embeds: [embed], components: [dis]})
    }
    let m = await message.channel.send({ embeds: [embed], components: [pages(page)]})
    
    let collector = m.createMessageComponentCollector({ componentType: "BUTTON", time: 85000 * 1000})
    collector.on("collect", async (i) => {
      try {
        if(i.user.id) {
          if(i.customId === "previous_button") {
            i0 = i0 - 10
            i1 = i1 - 10
            page = page - 1
            embed.setDescription(
              message.guild.emojis.cache.map(opt => opt).map((opt, i) => {
                if(opt.animated === true) return `${i+1} - ${opt} \`<a:${opt.name}:${opt.id}>\``
                if(opt.animated === false) return `${i+1} - ${opt} \`<:${opt.name}:${opt.id}>\``
              }).slice(i0, i1).join("\n")
            ) 
              embed.setFooter(`Page ${page}/${Math.ceil(message.guild.emojis.cache.size / 10)}`)
            await i.update({ embeds: [embed], components: [pages(page)]})
          } else if(i.customId === "next_button") {
            i0 = i0 + 10
            i1 = i1 + 10
            page = page + 1
            embed.setDescription(message.guild.emojis.cache.map(opt => opt).map((opt, i) => {
              if(opt.animated === true) return `${i+1} - ${opt} \`<a:${opt.name}:${opt.id}>\``
              if(opt.animated === false) return `${i+1} - ${opt} \`<:${opt.name}:${opt.id}>\``
        }).slice(i0, i1).join("\n"))
            embed.setFooter(`Page ${page}/${Math.ceil(message.guild.emojis.cache.size / 10)}`)
            await i.update({embeds: [embed], components: [pages(page)]})
          }
        } else {
          return i.deferUpdate()
        }
      } catch(e) {
        return
      }
    })
    collector.on('end', async (i) => {
      try {
        m.edit({ components: []})
      } catch(e) {
        return
      }
    })
  }
}
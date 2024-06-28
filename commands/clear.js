const { MessageButton, MessageActionRow, MessageEmbed } = require("discord.js")
const lang = require("../language")

module.exports = {
  name: "clear",
  aliases:["purge"],
  permission: ["MANAGE_MESSAGES"],
  botPermission: ["MANAGE_MESSAGES"],
  run: async (client, msg, args) => {
    
    let purge = args[0]
    if(!purge) return msg.channel.send({ content: "<prefix>clear <amount>"})
    if(purge > 100) purge = 100;
    
    try {
      const fetch = await msg.channel.messages.fetch({ limit: purge })
      
      const deleteMessage = await msg.channel.bulkDelete(fetch, true)
      
      const result = {};
      for (const [, deleted] of deleteMessage) {
        
        const user = `${deleted.author.username}#${deleted.author.discriminator}`
        if(!result[user]) result[user] = 0;
        result[user]++;
      }
      
      const userMessageMap = Object.entries(result)
      const finalResult = `${deleteMessage.size} ${deleteMessage.size > 1 ? '** **' : ''} ${lang(msg.guild, "REMOVED")}\n\n${userMessageMap.map(([user, messages]) => `\`${user}\`: ${messages} ${lang(msg.guild, "MESSAGE")}`).join("\n")}`
      
      const Embed = new MessageEmbed()
      .setColor("BLUE")
      .setDescription(finalResult)
      
      await msg.channel.send({ embeds: [Embed] }).then(mg => setTimeout(() => mg.delete(), 7000))
    } catch(e) {
      msg.channel.send({ content: e.message})
    }
  }
}
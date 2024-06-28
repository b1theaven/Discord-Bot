const Discord = require('discord.js');
const lang = require('../language')
module.exports = {
  name: 'addemoji',
  permission: ["ADMINISTRATOR"],
  botPermission: ["ADMINISTRATOR"],
  run: async (client, message, args) => {
    const msg = message
    if (!args.length) return message.channel.send({ content: lang(msg.guild, "SPECIFY_EMOJI") })
    try {
      for (const emojis of args) {
        const getEmoji = Discord.Util.parseEmoji(emojis);

        if (getEmoji.id) {
          try {
            const emojiExt = getEmoji.animated ? ".gif" : ".png";
            const emojiURL = `https://cdn.discordapp.com/emojis/${getEmoji.id + emojiExt}`
            message.guild.emojis.create(emojiURL, getEmoji.name).then(emoji => message.channel.send({ content: `${lang(msg.guild, "EMOJI_ADDED")} : ${emoji}` }))
          } catch(e) {
            return msg.channel.send({ content: lang(msg.guild, "DEVICE_ERROR") + " " + e.messsage})
          }
        }
      } 
    } catch(e) {
          return msg.channel.send({ content: lang(msg.guild, "DEVICE_ERROR") + " " + e.messsage})
    }
  }
}
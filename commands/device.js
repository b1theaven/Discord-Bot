const lang = require("../language")

module.exports = {
name: "device",
run: async (client, message, args) => {
  const msg = message
       const user = message.mentions.members.first() || message.guild.members.cache.get((args[0])) || client.users.cache.find(m => m.username === args.slice(0).join(" ")) || msg.member
        let enru = {
            web:"Browser",
            desktop:"Computer",
            mobile:"Mobile"
        }
        try {
          const userDevice = Object.keys(user.presence.clientStatus)[0]
          const device = enru[userDevice] ? enru[userDevice] : "Unknown"
message.channel.send({ content: `${lang(msg.guild, "DEVICE_USED")} ${user.user.username}: **${device}**` })
        } catch (e) {
            message.channel.send({ content: `${lang(msg.guild, "DEVICE_ERROR")}: \`${e.message}\`` })
        }
}
}
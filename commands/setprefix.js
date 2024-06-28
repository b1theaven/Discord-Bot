const {stripIndents} = require("common-tags")
const prefixSchema = require('../models/prefix.js')
const lang = require('../language')
module.exports = {
    name: "setprefix",
    run: async (client, msg, args) => {
      let prefix;
      let dataPrefix = await prefixSchema.findOne({ guild: msg.guild.id })
      if(dataPrefix === null) {
        prefix = '.'
      } else {
        prefix = dataPrefix.prefix
      }
        if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send({ content: "**"+lang(msg.guild, "MISSING_PERMISSION")+"**"+"\n\n"+lang(msg.guild, "ADMINISTRATOR_PERMISSION") })
      prefixSchema.findOne({ guild: msg.guild.id }, async(err, data) => {
        const newprefix = args[0]
        if(!newprefix) return msg.channel.send({ content: stripIndents`
\`\`\`a

${lang(msg.guild, "INPUT_NEW_PREFIX")}

${lang(msg.guild, "EXAMPLE")}: ${prefix}setprefix !
\`\`\`` })
        if(newprefix.length > 3) return msg.channel.send({ content: lang(msg.guild, "PREFIX_LONG") })
        if(!data) {
          let newData = await prefixSchema.create({
            guild: msg.guild.id,
            prefix: newprefix
          })
        } else {
          await prefixSchema.findOneAndUpdate(
            {
              guild: msg.guild.id
            },
            {
              guild: msg.guild.id,
              prefix: newprefix
            },
            {
              upsert: true
            }
            )
        }
        msg.channel.send({ content: stripIndents`
\`\`\`a

${lang(msg.guild, "PREFIX_SET")} ${newprefix}
\`\`\`` })
    })
    }
}
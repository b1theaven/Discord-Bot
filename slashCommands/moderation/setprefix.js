const prefixSchema = require("../../models/prefix")
const lang = require("../../language")
module.exports = {
  name: "setprefix",
  description: "Set prefix of bot",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "prefix",
      description: "Provide new prefix of bot",
      type: 3,
      required: true
    }
    ],
  execute: async(client, interaction, args) => {
    const prefix = interaction.options.getString("prefix")
    const data = await prefixSchema.findOne({
      guild: interaction.guild.id
    })
    
    if(!data) {
      const newData = await prefixSchema.create({
        guild: interaction.guild.id,
        prefix: prefix
      })
      newData.save()
    } else {
      await prefixSchema.findOneAndUpdate(
        {
          guild: interaction.guild.id
        },
        {
          guild: interaction.guild.id,
          prefix: prefix
        },
        {
          upsert: true
        }
        )
    }
    interaction.reply({ content: lang(interaction.guild, "PREFIX_SET") + " " + prefix})
  }
}
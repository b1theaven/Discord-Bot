const { Client, Interaction } = require("discord.js")
const { setLanguage } = require("../../language")
const langSchema = require("../../models/language")
const languanges = require('../../language')
const { loadLanguages } = require("../../language")
module.exports = {
  name: "setlanguage",
  description: "Change the language of the bot",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: "language",
      description: "Select the language",
      type: 3,
      required: true,
      choices: [
        {
          name: "English",
          value: "en"
        },
        {
          name: "Indonesian",
          value: "id"
        },
        {
          name: "Japan",
          value: "jp"
        }
        ]
    }
    ],
  execute: async(client, interaction, args) => {
    const [ language ] = args
    const data = await langSchema.findOne({
      _id: interaction.guild.id
    })
    
      if(!data) {
        const newData = await langSchema.create({
          _id: interaction.guild.id,
          language: language
        }) 
        newData.save()
      } else {
        await langSchema.findOneAndUpdate(
          {
            _id: interaction.guild.id
          },
          {
            _id: interaction.guild.id,
            language: language
          },
          {
            upsert: true
          }
          )
      }
      setLanguage(interaction.guild, language)
      loadLanguages(client)
      return interaction.reply({ content: languanges(interaction.guild, "LANGUAGE_SET")})
    }
  }
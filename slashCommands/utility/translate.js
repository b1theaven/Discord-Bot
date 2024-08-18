
const translate = require('@iamtraction/google-translate');
const { MessageEmbed } = require("discord.js")
module.exports = {
  name: "translate",
  description: "Translate a message",
  options: [
    {
      name: "message",
      type: "STRING",
      description: "Message to translate",
      required: true
    },
    {   
      
      name: "language",
      type: "STRING",
      description: "Select the language",
      required: true,
      choices: [
        {
          name: 'English',
          value: 'en'
        },
        {
          name: "German",
          value: 'de'
        },
        {
          name: "French",
          value: "fr"
        },
        {
          name: "Italian",
          value: "it"
        },
        {
          name: "Spanish",
          value: "es"
        },
        {
          name: "Japanese",
          value: "ja"
        },
        {
          name: "Korean",
          value: "ko"
        },
        {
          name: "Chinese",
          value: "zh-CN"
        },
        {
          name: "Russian",
          value: "ru"
        },
        {
          name: "Swedish",
          value: "sv"
        },
        {
          name: "Indonesian",
          value: "id"
        },
        {
          name: "Malaysia",
          value: "ms"
        },
        {
          name: "Thailand",
          value: "th"
        },
        {
          name: "Vietnamese",
          value: 'vi'
        }
      ]
    
   }
    ],
  execute: async (client, interaction, args) => {
    const message = interaction.options.getString('message');
    const language = interaction.options.get('language').value;
    const translated = await translate(message, { to: language });
    const embed = new MessageEmbed()
    .setColor("BLUE")
    .setAuthor(interaction.member.user.username, interaction.member.user.displayAvatarURL({ dynamic: true }))
    .setTitle("Translated")
    .setDescription(`\`\`\`${message}\`\`\``)
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .addField("Language Codes", language)
    .addField("Message", `\`\`\`${translated.text}\`\`\``)
    .setTimestamp()
    await interaction.reply({ embeds: [embed]})
    }
}
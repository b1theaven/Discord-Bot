const { MessageEmbed } = require('discord.js')
const gpt = require('puppeteer-core')
const apiKey = "PUT_YOUR_API_KEY"
const models = [
  {
    name: "default",
    models: "meta/meta-llama-3-70b-instruct"
   }
  ]
module.exports = {
  name: "chat-gpt",
  description: "Chat GPT response",
  options: [
    {
      name: "prompt",
      description: "Ask something to Chat GPT",
      required: true,
      type: "STRING"
    }
  ],
  execute: async(client, interaction, args) => {
    try {
    const { options } = interaction
    const prompt = options.getString('prompt')
    await interaction.reply({ content: "Loading your response... this could take some time"})
    const { default: Replicate } = await import("replicate")
    const replicate = new Replicate({

       auth: apiKey
})
    setTimeout(async () => {
    const model = models[0].models
    const output = await replicate.run(model, { input: {prompt }})
    const value = output
    const embed = new MessageEmbed()
    .setColor("GREEN")
    .setAuthor(interaction.member.user.username, interaction.member.user.displayAvatarURL({ dynamic: true}))
    .setDescription("**There is result from** "+"\`\`\`"+prompt+"\`\`\`")
    .addField(' ', `\`\`\`${messageLimit(value.join(''))}\`\`\``)
    await interaction.editReply({ embeds: [embed]})
    }, 30000)
  } catch (e) {
    await interaction.editReply({ content: "Uh! there was an error getting the response"})
  }
 }
}


function messageLimit(str) {
  if (str.length > 1000) {
      return str.substring(0, 1001) + '...';
  } else {
      return str;
  }
}
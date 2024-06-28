const { slashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')
const fs = require("fs");
module.exports = {
  name: "reloadcommands",
  description: "Reload the slashCommands. Owner only",
  ownerOnly: true,
  execute: async(client, interaction, args) => {
    const cmdFolders = fs.readdirSync("./slashCommands");

  const cmdArr = [];
  cmdFolders.forEach(cmdFolder => {
    const cmdFiles = fs.readdirSync(`./slashCommands/${cmdFolder}`).filter(f => f.endsWith(".js"));

    cmdFiles.forEach(file => {
      const command = require(`../../slashCommands/${cmdFolder}/${file}`)
      })
  })  
    cmdArr.forEach(async cmd => {
        await client.guilds.cache.forEach(async gu => {
          await gu?.commands.delete(cmd).catch(err => {})})
        })
     await interaction.reply({ content: 'Reloading.....' })
    setTimeout(async function() {
      cmdArr.forEach(async cmd => {
        await client.guilds.cache.forEach(async gu => {
          await gu?.commands.create(cmd).catch(err => {})})
        })
      interaction.editReply({ content: 'Done.'})
    }, 5000)
  }
}
const fs = require("fs");

module.exports = (client) => {
  const cmdFolders = fs.readdirSync("./slashCommands");

  const cmdArr = [];
  cmdFolders.forEach(cmdFolder => {
    const cmdFiles = fs.readdirSync(`./slashCommands/${cmdFolder}`).filter(f => f.endsWith(".js"));

    cmdFiles.forEach(file => {
      const command = require(`../slashCommands/${cmdFolder}/${file}`)

      if (command.name && command.execute) {
        client.slashCommands.set(command.name, command);
        cmdArr.push(command)
      }
    })
  });

  client.on('ready', async () => {
    try {
      cmdArr.forEach(async cmd => {
        console.log("Loaded Slash Commands " + cmd.name);
        await client.guilds.cache.forEach(async guild =>{
          await guild?.commands.create(cmd).catch(err => {})
        })
      })
    } catch (err) {}
  })
  client.on("guildCreate", async (guild) => {
    try {
      cmdArr.forEach(async cmd => {
        console.log("Loaded Slash Commands from guild " + guild.name + ` (${cmd.name})`)
        await client.guilds.cache.forEach(async gu => {
          await gu?.commands.create(cmd).catch(err => {})
        })
      })
    } catch (err) {}
  })
  client.on("guildDelete", async (guild) => {
    try {
      cmdArr.forEach(async cmd => {
        console.log("Deleted Slash Commands from guild " + guild.name + ` (${cmd.name})`)
        await client.guilds.cache.forEach(async gu => {
          await gu?.commands.delete(cmd).catch(err => {})
        })
      })
    } catch (err) {}
  })
}
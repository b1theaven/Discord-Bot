const fs = require("fs")
const { MessageEmbed } = require("discord.js")
module.exports = {
  name: "reload",
  ownerOnly: true,
  run: async (client, message, args) => {
    if(!args[0]) return message.channel.send({ content: "a.reload all / <command name>"})
    if(args[0] === "all") {
      const reloadEmbed = new MessageEmbed()
      .setColor("BLUE")
      .setDescription(`Reloaded commands **${client.commands.size}**\n\n${client.commands.map(e => e.name).join("\n")}`)
      message.channel.send({ embeds: [reloadEmbed] })
      fs.readdir("./commands/", (err, files) => {
        if (err) return console.log(err);
        files.forEach(file => {
          if (!file.endsWith(".js")) return;
          delete require.cache[require.resolve(`./${file}`)];
          let props = require(`../commands/${file}`);
          let commandName = file.split(".")[0];
          client.commands.set(commandName, props);
        })
      })
    } else {
      try {
        delete require.cache[require.resolve(`./${args[0]}.js`)];
        client.commands.delete(args[0])
        const pull = require(`./${args[0]}.js`)
        client.commands.set(args[0], pull)
      } catch (e) {
        return message.channel.send({ content: `Unable to reload \`${args[0]}\`\nError: \`${e.message}\``})
      }
      message.channel.send({ content: `Successfully reload **${args[0]}**`})
    }
    if(args[0] === 'language') {
      require('../language').loadLanguages(client)
      message.channel.send({ content: 'Languages reloaded' })
    }
  }
}
const { EmbedBuilder } = require('discord.js');
const ms = require("ms")
const discord = require("discord.js")
const schema = require("../models/commands")
const {stripIndents} = require("common-tags")
const humanizeDuration = require("humanize-duration")
const prefixSchema = require('../models/prefix')
const Discord = require('discord.js')
const lang = require('../language')
 exports.run = async(client, message) => {
     const msg = message
     let prefix;
     let dataPrefix = await prefixSchema.findOne({
     guild: message.guild.id
      })
     if(dataPrefix === null) {
    prefix = 'a.'
  } else {
    prefix = dataPrefix.prefix
  }
   
     let messageArray = message.content.split(" "),
     cmd = messageArray[0],
     args = messageArray.slice(1),
     commandfile = client.commands.get(cmd.slice(prefix.length)) || client.aliases.get(cmd.slice(prefix.length));
   if (message.author.bot) return;
   
   if (message.content.startsWith(prefix)) {
  
     if(!commandfile) return;
     if(commandfile.ownerOnly) {
       if(!['671351376642834440', '1005082777206661190', '627027667685867530'].includes(msg.author.id)) {
         return
       }
     }
     if(commandfile.permission) {
       const authorPerms = msg.channel.permissionsFor(msg.member)
        if(!authorPerms || !authorPerms.has(commandfile.permission)) {
          const permEmbed = new Discord.MessageEmbed()
          .setColor("BLUE")
          .setDescription(lang(msg.guild, "MISSING_PERMISSION") + "\n\n" + lang(msg.guild, "INTERACTION_PERMISSION") + " \`" + commandfile.permission + "\`")
          return msg.reply({ embeds: [permEmbed]})
        }
      }
    if(commandfile.botPermission) {
      const botPerms = msg.channel.permissionsFor(client.user)
      if(!botPerms || !botPerms.has(commandfile.botPermission)) {
        const botPermEmbed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setDescription(lang(msg.guild, "MISSING_PERMISSION") + "\n\n"+ lang(msg.guild, "BOT_PERMISSION") + " \`" + commandfile.botPermission + "\`")
        return msg.reply({ embeds: [botPermEmbed]})
      }
    }
      const check = await schema.findOne({ Cmds: commandfile.name })
    if(check) {
        if(check.Cmds.includes(commandfile.name)) return message.channel.send({ content: lang(msg.guild, 'COMMAND_DISABLE') }) 
        commandfile.run(client, message, args) 
  }
      if(client.cooldown.has(`${message.author.id}-${commandfile.name}`)) {
          return message.channel.send({ content: stripIndents`
          **${lang(msg.guild, 'COMMAND_COOLDOWN')}**: \`${humanizeDuration(client.cooldown.get(`${msg.author.id}-${commandfile.name}`) - Date.now())}\`` })
      }
    commandfile.run(client, message, args); 
    
      if(commandfile.cooldown) {
        const timeOut = (commandfile.cooldown) * 1000
          client.cooldown.set(`${message.author.id}-${commandfile.name}`, Date.now() + timeOut);
          setTimeout(() => {
              client.cooldown.delete(`${message.author.id}-${commandfile.name}`)
          }, timeOut)
      }
  }
 }
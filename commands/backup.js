const backup = require("discord-backup")
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")
const choice = ["✅", "❌"]
const prefixSchema = require('../models/prefix')
const {stripIndents} = require("common-tags")
const lang = require('../language')
module.exports = {
    name: "backup",
    cooldown: 5,
    run: async (client, msg, args) => {
        if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send({ content: "**"+lang(msg.guild, "MISSING_PERMISSION")+"**"+"\n\n"+lang(msg.guild, "ADMINISTRATOR_PERMISSION") })
        let prefix;
        const dataPrefix = await prefixSchema.findOne({ guild: msg.guild.id})
        if(dataPrefix === null) {
          prefix = '.'
        } else {
          prefix = dataPrefix.prefix
        }
      
      
      const acceptButton = new MessageButton()
      .setCustomId("accept")
      .setStyle("SUCCESS")
      .setLabel(lang(msg.guild, "ACCEPT"))
      
      const cancelButton = new MessageButton()
      .setCustomId("cancel")
      .setStyle("DANGER")
      .setLabel(lang(msg.guild, "CANCEL"))
      
      const row = new MessageActionRow()
      .addComponents(
        acceptButton,
        cancelButton
        )
      
      const filter = i => i.customId == ["accept", "cancel"] && i.user.id === msg.author.id
        const missingArgs = new MessageEmbed()
        .setColor("RED")
        .setTitle(lang(msg.guild, "VALID_PARAMETER"))
        .setDescription(stripIndents`
\`${prefix}backup create\` -> ${lang(msg.guild, "SERVER_SAVES")}
\`${prefix}backup load <ID>\` -> ${lang(msg.guild, "LOAD_SERVER")}
\`${prefix}backup info <ID>\` -> ${lang(msg.guild, "SHOW_INFO")}`)
        if(!args[0]) return msg.channel.send({ embeds: [missingArgs] })
        
        if(args[0] === "create") {
            if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send({ content: lang(msg.guild, "ADMINISTRATOR_PERMISSION") })
            backup.create(msg.guild).then((backupData) => {
                const backupDatabase = new MessageEmbed()
                .setColor("GREEN")
                .setTitle(lang(msg.guild, "BACKUP_CREATED_SUCCESS"))
                .setDescription(stripIndents`
Backup ID: ${backupData.id}
${prefix}backup load ${backupData.id} ${lang(msg.guild, "TO_LOAD_BACKUP")}`)
                msg.author.send({ embeds: [backupDatabase] })
                msg.channel.send({ content: lang(msg.guild, "BACKUP_SUCESS_CREATED") })
            }).catch((e) => {
              console.log(e)
                return msg.channel.send({ content: lang(msg.guild, "BACKUP_PERMISSION_MISSING") })
            })
        } else if(args[0] === "load") {
          
                if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send(lang(msg.guild, "ADMINISTRATOR_PERMISSION"))
            if(!args[1]) return msg.channel.send({ content: lang(msg.guild, "VALID_BACKUP_ID") })
            
            backup.fetch(args[1]).then(async () => {
                const waitEmbed = new MessageEmbed()
                .setColor("YELLOW")
                .setTitle(lang(msg.guild, "WAITING_BACKUP"))
                .setDescription(stripIndents`
                \`\`\`a
                ${lang(msg.guild, "BACKUP_WARNING")}
                \`\`\``)
                msg.channel.send({ embeds: [waitEmbed], components: [row] }).then(m => {
                    const collector = m.createMessageComponentCollector(filter, { time: 60 * 1000, max: 1 })
                    collector.on("collect", async (i) => {
                        if(i.customId === "accept") {
                            await i.update({ components: [] })
                            m.edit({ content: `:white_check_mark: ${lang(msg.guild, "BACKUP_START")}` })
                            backup.load(args[1], msg.guild).then(() => {
                                backup.remove(args[1])
                            }).catch((err) => {
                                m.edit({ content: lang(msg.guild, "BACKUP_PERMISSION_MISSING") })
                            })
                        }
                        if(i.customId === "cancel") {
                          await i.update({ components: [] })
                            m.edit({ content: lang(msg.guild, "BACKUP_CANCEL") })
                        }
                })
            }).catch((err) => {
                return msg.channel.send({ content: lang(msg.guild, "BACKUP_NOT_FOUND") })
            })
            })
        } else if(args[0] === "info") {
            if(!args[1]) return msg.channel.send({ content: lang(msg.guild, "VALID_BACKUP_ID") })
            backup.fetch(args[1]).then((backupInfo) => {
                const date = new Date(backupInfo.data.createdTimestamp);
                const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
                const formatedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;
                const infoEmbed = new MessageEmbed()
                .setColor("BLUE")
                .setTitle("Backup Information")
                .addFields(
                    { name: "Backup ID", value: backupInfo.id, inline: true },
                    { name: "Server ID", value: backupInfo.data.guildID, inline: true },
                    { name: lang(msg.guild, "BACKUP_SIZE"), value: backupInfo.size + " " + "kb", inline: true },
                    { name: lang(msg.guild, "BACKUP_CREATED_AT"), value: formatedDate, inline: true },
                    )
                msg.channel.send({ embeds: [infoEmbed] })
                }).catch((err) => {
                return msg.channel.send({ content: `${lang(msg.guild, "DEVICE_ERROR")} \`${err.message}\`` })
            })
        }
    }
}
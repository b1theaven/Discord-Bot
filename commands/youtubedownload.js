const fs = require("fs")
const ytdl = require("ytdl-core")
const discord = require("discord.js")
const { MessageButton, MessageActionRow } = require("discord.js")
const ytsr = require("ytsr")
const fileName = randomName(6)
const {stripIndents} = require('common-tags')
const choice = ['871703562399416342', '871705764392235019']
const lang = require('../language')
module.exports = {
    name: "youtubedownload",
    aliases: ["ytdl"],
    cooldown: 30,
    description: "Download music",
    run: async (client, msg, args) => {
            const query = args.join(" ")
            if(!query) return msg.channel.send({ content: "Enter the name of the song"})
            const wait = await msg.channel.send({ content: `Searching the music \`${query}\`...` })
            ytsr(query).then(async i => {
                try {
                const music = i.items[0]
                const url = "http://www.youtube.com/watch?v=" + music.id
                const song = await ytdl(url, { quality: 'highestaudio', format: "mp3", filter: "audioonly"}).pipe(fs.createWriteStream("music/"+ fileName + ".mp3"))
                const musicEmbed = new discord.MessageEmbed()
                .setColor("GREEN")
                .setTitle(music.title)
                .setDescription(stripIndents`
${lang(msg.guild, "NAME")}: \`${music.title}\`
${lang(msg.guild, "SONG_DURATION")}: \`${music.duration}\`
${lang(msg.guild, "SELECT_BUTTON")}`)
                const buttonDownload = new MessageButton()
                .setCustomId("download")
                .setLabel("Download")
                .setStyle("SUCCESS")
                
                const buttonCancel = new MessageButton()
                .setCustomId("cancel")
                .setLabel("Cancel")
                .setStyle("DANGER")
                
                
                const row = new MessageActionRow()
                .addComponents(
                  buttonDownload,
                  buttonCancel
                  )
                const buttonFilter = i => i.customId == ["download", "cancel"] && i.user.id === msg.author.id;
                
                
                msg.channel.send({ embeds: [musicEmbed], components: [row] }).then(m => { 
                const filter = (rect, usr) => choice.includes(rect.emoji.id) && usr.id === msg.author.id;
                     const collector = m.createMessageComponentCollector({ componentType: "BUTTON", time: 60 * 1000, max: 1})
                     collector.on("collect", async (i) => {
                       try {
                      if(i.user.id === msg.author.id) {
                         if(i.customId === "download") {
                             await i.update({ components: [] })
                             buttonDownload.setDisabled(true)
                             buttonCancel.setDisabled(true)
                             const downloadWait = new discord.MessageEmbed()
                             .setColor("YELLOW")
                             .setDescription(`Downloading... (15%)`)
                              const downloadWait2 = new discord.MessageEmbed()
                             .setColor("YELLOW")
                             .setDescription(`Downloading... (45%)`)
                               const downloadWait3 = new discord.MessageEmbed()
                             .setColor("YELLOW")
                             .setDescription(`Downloading... (75%)`)
                                 const downloadWait4 = new discord.MessageEmbed()
                             .setColor("YELLOW")
                             .setDescription(`Downloading... (100%)`)
                                   const downloadSuccess = new discord.MessageEmbed()
                             .setColor("GREEN")
                             .setDescription("Success")
                                   const downloadFailed = new discord.MessageEmbed()
                                   .setColor("RED")
                                   .setDescription(stripIndents`
                                   Failed`)
                              const waiting = await msg.channel.send({ embeds: [downloadWait] })
                             setTimeout(async function() {
                                 waiting.edit({ embeds: [downloadWait2] })
                             }, 3000)
                              setTimeout(async function() {
                                 waiting.edit({ embeds: [downloadWait3] })
                             }, 5000)
                              setTimeout(async function() {
                                 waiting.edit({ embeds: [downloadWait4] }).then(m => m.delete({timeout: 15000}))
                             }, 8000)
                              setTimeout(async function() {
                                 const tes = fs.readFileSync("music/"+ fileName +".mp3")
                                 const file = new discord.MessageAttachment(tes, music.title+".mp3")
                                 msg.channel.send({ files: [file] })
                                 }, 12000)
                             setTimeout(async function() {
                                 fs.unlinkSync("music/"+ fileName +".mp3")
                                 collector.stop("downloaded")
                             },  20000)
                         }
                      } else {
                        return
                      }
                    if(i.user.id === msg.author.id) {
                        if(i.customId === "cancel") {
                             await i.update({ components: []})
                             m.edit({ content: lang(msg.guild, "CANCELED") })
                             buttonDownload.setDisabled(true)
                             buttonCancel.setDisabled(true)
                             fs.unlinkSync("music/"+ fileName +".mp3")
                          collector.stop("downloaded")
                         }
                    } else {
                      return
                    }
                         } catch(e) {
                             return msg.channel.send({ content: e.message })
                         }
                })
                  collector.on("end", async(ignore, err) => {
                    if(err && err !== "downloaded") {
                      try {
                        console.log('Delete music from folder...')
                        wait(30000)
                        console.log("Deleted music success")
                        fs.unlinkSync("music/"+fileName+".mp3")
                      } catch(e) {
                        return
                      }
                    }
                    collector.stop("downloaded")
                  })
                })
                } catch(e) {
                    return msg.channel.send({ content: e.message })
                }
            })
    }
}

function randomName(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return "KGY" + result;
}
const { MessageButton, MessageEmbed, MessageActionRow, MessageAttachment } = require('discord.js')
const ytsr = require('ytsr')
const fs = require("fs")
const ytdl = require("ytdl-core")
const fileName = randomName(6)
const lang = require('../../language')
const {stripIndents} = require('common-tags')
const wait = require("util").promisify(setTimeout)
module.exports = {
  name: "youtubedownload",
  description: "Download music from youtube",
  options: [
    {
      name: "music",
      description: "Please enter the name of the music you want",
      type: "STRING",
      required: true
    }
  ],
  execute: async (client, interaction, args) => {
    const [ music ] = args
    await interaction.reply({ content: `${lang(interaction.guild, "SEARCHING_MUSIC")} \`${music}\`...` })
    ytsr(music).then(async i => {
      const music = i.items[0]
       const url = "http://www.youtube.com/watch?v=" + music.id
       const song = await ytdl(url, { quality: 'highestaudio', format: "mp3", filter: "audioonly"}).pipe(fs.createWriteStream("music/"+ fileName + ".mp3"))
                const musicEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle(music.title)
                .setDescription(stripIndents`
${lang(interaction.guild, "NAME")}: \`${music.title}\`
${lang(interaction.guild, "SONG_DURATION")}: \`${music.duration}\`

${lang(interaction.guild, "SELECT_BUTTON")}`)
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
                const buttonNotForUser = new MessageEmbed()
                .setColor("BLUE")
                .setDescription("These buttons aren't for you")
                const buttonFilter = i => i.customId == ["download", "cancel"] && i.user.id === interaction.member.user.id;
                const mem =  interaction.guild.members.cache.get(interaction.user.id);
               await interaction.editReply({ embeds: [musicEmbed], components: [row] }).then(m => { 
                     const collector = m.createMessageComponentCollector({ componentType: "BUTTON", time: 60 * 1000 })
                     collector.on("collect", async (i) => {
                    if(i.user.id === mem.user.id) {
                       if(i.customId === "download") {
                             await i.update({ components: [] })
                             buttonDownload.setDisabled(true)
                             buttonCancel.setDisabled(true)
                             const downloadWait = new MessageEmbed()
                             .setColor("YELLOW")
                             .setDescription(`<a:1606download:871703562399416342> ${lang(interaction.guild, "DOWNLOADING")}... (15%)`)
                              const downloadWait2 = new MessageEmbed()
                             .setColor("YELLOW")
                             .setDescription(`<a:1606download:871703562399416342> ${lang(interaction.guild, "DOWNLOADING")}... (45%)`)
                               const downloadWait3 = new MessageEmbed()
                             .setColor("YELLOW")
                             .setDescription(`<a:1606download:871703562399416342> ${lang(interaction.guild, "DOWNLOADING")}... (75%)`)
                                 const downloadWait4 = new MessageEmbed()
                             .setColor("YELLOW")
                             .setDescription(`<a:1606download:871703562399416342> ${lang(interaction.guild, "DOWNLOADING")}... (100%)`)
                                   const downloadSuccess = new MessageEmbed()
                             .setColor("GREEN")
                             .setDescription(lang(interaction.guild, "DOWNLOAD_SUCCESS"))
                                   const downloadFailed = new MessageEmbed()
                                   .setColor("RED")
                                   .setDescription(stripIndents`
                                   ${lang(interaction.guild, "FILE_SENT_FAILED")}`)
                              const waiting = await interaction.editReply({ embeds: [downloadWait] })
                             setTimeout(async function() {
                                 interaction.editReply({ embeds: [downloadWait2] })
                             }, 3000)
                              setTimeout(async function() {
                                 interaction.editReply({ embeds: [downloadWait3] })
                             }, 5000)
                              setTimeout(async function() {
                                 interaction.editReply({ embeds: [downloadWait4] }).then(m => {
                                   setTimeout(() => m.delete(), 3000)
                                 })
                             }, 8000)
                              setTimeout(async function() {
                                 const tes = fs.readFileSync("music/"+ fileName +".mp3")
                                 const file = new MessageAttachment(tes, music.title+".mp3")
                                 interaction.channel.send({ files: [file] }).catch((e) => {
                                     interaction.editReply({ embeds: [downloadFailed] })
                                 })
                              }, 10000)
                             setTimeout(async function() {
                                 fs.unlinkSync("music/"+ fileName +".mp3")
                             },  15000)
                         collector.stop("downloaded")
                       }
                    } else {
                      return i.reply({ embeds: [buttonNotForUser], ephemeral: true})
                    }
                  if(i.user.id === mem.user.id) {
                      if(i.customId === "cancel") {
                             await i.update({ components: []})
                             interaction.editReply({ content: lang(interaction.guild, "CANCELED") })
                             buttonDownload.setDisabled(true)
                             buttonCancel.setDisabled(true)
                             fs.unlinkSync("music/"+ fileName + ".mp3")
                        collector.stop("downloaded")
                         }
                  } else {
                    return i.reply({ embeds: [buttonNotForUser], ephemeral: true})
                  }
                     })
                 collector.on("end", async(ignore, err) => {
                   if(err && err !== "downloaded") {
                     try {
                       console.log('Delete music from folder...')
                       wait(3000)
                       console.log("Deleted music success")
                       fs.unlinkSync("music/"+fileName+".mp3")
                     } catch(e) {
                       console.log('Delete music from folder...')
                       wait(3000)
                       console.log("Deleted music success")
                     }
                   }
                 })
                })
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
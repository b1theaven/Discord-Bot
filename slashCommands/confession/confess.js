const { MessageEmbed } = require('discord.js')
const confessSchema = require('../../models/confession')
const confessUser = require('../../models/confessionUser')
const humanizeDuration = require("humanize-duration")
const cooldown = new Set()
const cooldownTime = 480000
const confessID = randomName(5)
module.exports = {
    name: "confess",
    description: "Confess",
    options: [ 
        {
        name: 'confession',
        type: "STRING",
        description: "Kata-kata indah mu",
        required: true
    },
    {
        name: "attachment",
        type: "ATTACHMENT",
        description: "Confess menggunakan gambar/gif (fitur belum tersedia developer sedang malas)",
        required: false
    }
],
  execute: async(client, interaction, args) => {
    if (cooldown.has(interaction.user.id)) {
    return interaction.reply({ content: `Hai! kamu harus menunggu **${humanizeDuration(cooldownTime)}** untuk mengirim confess kembali`, ephemeral: true });
    
  } else {
    const confess = await interaction.options.getString('confession')
    const attachment = await interaction.options.getAttachment('attachment')
    //console.log(attachment.size)
    const data = await confessSchema.findOne({ guild: interaction.guild.id })
    if(!data) return interaction.reply({ content: ":x: Em! tidak dapat menemukan data confess atau admin menghapus fitur confession", ephemeral: true})
    const userData = await confessUser.findOne({ id: interaction.member.id })
    if(!userData) {
        await confessUser.create({
            id: interaction.member.id,
            confessionID: confessID,
            blacklist: "unblacklist"
        })
    } 
    if(userData.blacklist === "blacklist") {
        return interaction.reply({ content: ":x: Kamu telah di blacklist oleh admin", ephemeral: true})
    }


    data.confession += 1
    await data.save()
    const embed = new MessageEmbed()
    .setColor("BLUE")
    .setAuthor("Anonymous Confession #"+ data.confession, interaction.guild.iconURL({ dynamic: true }))
    .setDescription(confess)
    .setTimestamp()
    .setFooter(`${userData.confessionID} | Gunakan /confess untuk mengirim pesan anonim`)
    if(attachment) {
        if(attachment.contentType === "video/quicktime") {
     data.confession -= 1
     await data.save()
     return interaction.reply({ content: "Hi! untuk mengirim attachmentnya hanya bisa berfilekan \`jpg, jpeg, png, gif\`", ephemeral: true})

} else {
        embed.setImage(attachment.url ? attachment.proxyURL : null)
}
    }
      client.channels.cache.get(data.channel).send({ embeds: [embed]})
      await interaction.reply({ content: "Confess berhasil dikirim", ephemeral: true})
    cooldown.add(interaction.user.id)
    setTimeout(() => {
      cooldown.delete(interaction.user.id)
    }, cooldownTime)
  }
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
  return "Srv" + result;
}
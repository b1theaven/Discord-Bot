const Discord = require('discord.js')
const { stripIndents } = require('common-tags')
const messagelb = require('../../models/messagelb')
const levelSchema = require('../../models/level')
const canvafy = require("canvafy")
const { Client, Interaction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "leaderboard",
  description: "Menunjukkan 10 top leaderboard",
  options: [
    {
      name: "type",
      description: "Pilih leaderboard",
      type: 3,
      required: true,
      choices: [
        {
          name: "messages",
          value: "msg"
        },
        {
          name: "invites",
          value: "invt"
        },
        {
          name: "level",
          value: "lv"
        }
        ]
    }
    ],
  execute: async (client, interaction, args) => {
    const { guild, options } = interaction
    const type = options.get('type').value
    let [ messages, invites, level ] = args
      let embedChoice = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setAuthor("AERO Team Leaderboard", interaction.guild.iconURL({ dynamic: true}))
      .addField("/leaderboard message", "\`Menunjukan top 10 leaderboard berdasarkan pesan\`", true)
      .addField("/leaderboard invite", "\`Menunjukan top 10 leaderboard berdasarkan invite\`", true)
      .addField("/leaderboard level", "\`Menunjukan top 10 leaderboard berdasarkan level`", true)
      let choice = ["message", "invite"]
      if(!type) return interaction.interaction({ embeds: [embedChoice]})
      if(type == "msg") {
        const globalLeaderbordMessage = new Discord.MessageButton()
      .setCustomId('global_msg')
      .setLabel('Global Leaderboard Messages')
      .setStyle('SECONDARY');
        const row = new Discord.MessageActionRow()
      .addComponents(globalLeaderbordMessage);
        
        
        async function globalMessages() {
        let messages = await interaction.guild.channels
        var messagesGet = []
        await messages.cache.forEach(async a =>{
          await a.messages.fetch().then(e =>{

            messagesGet.push({ user: e.user.id, messages: e.messages.size})
          })

})
          return messagesGet
}
        //
        //
        //
        //
        //
        async function all() {
        let data = await messagelb
        .find({ guild: interaction.guild.id })
        let getAll = []
        await data.forEach( async a => {
          getAll.push({
            id: a.id,
            messages: a.Messages
          })
        })
        return getAll
      }
      let msg = interaction
      let data = await messagelb.findOne({ guild: interaction.guild.id })
      if(!data) return msg.channel.send({ content: "Tidak ada data leaderboard saat ini!"})
      else {
        let lb = await all()
        lb.sort((a, b) => b.messages - a.messages)
        let final = lb.slice(0, 10)
        
        let string;
        var num = 1
        await final.forEach ( async v => {
          const user = await msg.guild.members.cache.get(v.id)
          string += `${num}. <@${user.user.id}> ▬▬▬ Messages **(${v.messages} cached)**\n`
          num++
        })
        
        string = string.replace('undefined', '')
        let embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor('Top 10 leaderboard berdasarkan pesan', interaction.guild.iconURL({ dynamic: true}))
        .setDescription(string)
        .setFooter("Pesan dari database Serval")
        msg.reply({ embeds: [embed]})
       }
      }
      else if (type == "invt"){
      let invite = await interaction.guild.invites.fetch()
      let user = await interaction.guild.members.fetch()
      
      async function totalInvite(){
       let invites = []
       await user.forEach(async u => {
        let i = await invite.filter(a => a.inviter && a.inviter.id === u.user.id)
        let count = 0
        
        
        await i.forEach(async m => count += m.uses)
        invites.push({ member: u.user.id, invites: count})
})
        return invites
}
        let inviteLead = await totalInvite()
        inviteLead.sort((a, b) => b.invites - a.invites)
        let final = inviteLead.slice(0, 10)
        
        let string;
        let stringInvites;
        let stringMember
        let num = 1
        await final.forEach(async i => {
          const invitesTotal = await interaction.guild.members.fetch(i.member)
          string += `${num}. <@${invitesTotal.user.id}> ▬▬▬ Invites **(${i.invites} cached)**\n`
          stringInvites += `\`${i.invites}\`\n`
          stringMember += `**${num}.** <@${invitesTotal.user.id}>\n`
          num++
          
})
        stringMember = stringMember.replace('undefined', '')
        stringInvites = stringInvites.replace('undefined', '')
        string = string.replace("undefined", '')
        let inviteEmbed = new Discord.MessageEmbed()
        .setColor("GOLD")
        .setAuthor("Top 10 leaderboard berdasarkan invites", interaction.guild.iconURL({ dynamic: true}))
        .setDescription(string)
        //.addField("USER", stringMember, true)
        //.addField("INVITES", stringInvites, true)
        
      interaction.reply({ embeds: [inviteEmbed]})
}
      else if (type == "lv"){
        let string;
        let usersData
        let noLevel = new Discord.MessageEmbed()
        .setDescription("Belum ada data level saat ini")
        .setColor("RED")
        
        const levelData = await levelSchema.find({ guild: interaction.guild.id}).sort({ xp: -1, level: -1}).limit(10)
        if(!levelData) return interaction.reply({ embeds: [noLevel]})
        
        for (let count = 0; count < levelData.length; ++count){
          let { id, xp, level } = levelData[count]
          let value = await client.users.fetch(id) || "No data"
          let userSs = value.id
          string += `${count + 1}. <@${userSs}> • Xp: \`${xp}\` • Level: \`${level}\`\n`
          usersData = await Promise.all(levelData.map(async (id, index) => {
          let member = await client.users.fetch(id.id)
         const username = member.username
         const avatar = member.displayAvatarURL({ format: 'png', size: 128})
         return {
           top: index + 1,
           avatar: avatar,
           tag: username,
           score: id.level,
         }
        }))
        }
        //0let filterUser = usersData = usersData.filter(user => user !== null)
        string = string.replace('undefined', '')
        //console.log(usersData)
        let imageLeaderboard = await new canvafy.Top()
        .setOpacity(0.3)
        .setScoreMessage("Level:")
        .setabbreviateNumber(false)
        //.setBackground("image", "https://media.discordapp.net/attachments/1263443860525289603/1264478142790238229/IMG_1054.jpg?ex=669e048a&is=669cb30a&hm=e1f3fbfcbf6703b443ea8d1b6b0bd902953d8921e1d96e5e310b067de5082cdb&")
        .setColors({ box: '#212121', username: '#ffffff', score: '#ffffff', firstRank: '#f7c716', secondRank: '#9e9e9e', thirdRank: '#94610f' })
        .setUsersData(usersData) 
        .build()
        const finalImage = new Discord.MessageAttachment(imageLeaderboard, 'leaderboard.png')
         let levelEmbed = new Discord.MessageEmbed()
          .setColor("BLUE")
          .setAuthor("Top 10 leaderboard berdasarkan level", interaction.guild.iconURL({ dynamic: true}))
          .setDescription(string)
          .setFooter("AERO Team Leaderboard")
         let levelEmbed2 = new Discord.MessageEmbed()
          .setColor("BLUE")
          .setAuthor("Top 10 leaderboard berdasarkan level", interaction.guild.iconURL({ dynamic: true}))
          .setImage('attachment://leaderboard.png')
          .setDescription("Inilah top 10 leaderboard berdasarkan dari level")
          .setFooter("AERO Team Leaderboard")
          return interaction.reply({ embeds: [levelEmbed2], files: [finalImage]})
         // return message.channel.send({ files: [{ attachment: imageLeaderboard, name: "leaderboard.png"}]})
         // message.channel.send({ embeds: [levelEmbed]})
        }
    }
}
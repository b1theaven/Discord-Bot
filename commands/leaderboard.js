const Discord = require('discord.js')
const { stripIndents } = require('common-tags')
const messagelb = require('../models/messagelb')
const levelSchema = require('../models/level')
module.exports = {
    name: "messageleaderboard",
    cooldown: 5,
    run: async(client, message, args) => {
      let embedChoice = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setAuthor("AERO Team Leaderboard", message.guild.iconURL({ dynamic: true}))
      .addField("a.leaderboard message", "\`Menunjukan top 10 leaderboard berdasarkan pesan\`", true)
      .addField("a.leaderboard invite", "\`Menunjukan top 10 leaderboard berdasarkan invite\`", true)
      .addField("a.leaderboard level", "\`Menunjukan top 10 leaderboard berdasarkan level`", true)
      let choice = ["message", "invite"]
      if(!args[0]) return message.channel.send({ embeds: [embedChoice]})
      if(args[0] == "message" || args[0] == "messages" || args[0] == "msg" || args[0] == "Message" || args[0] == "Messages") {
        const globalLeaderbordMessage = new Discord.MessageButton()
      .setCustomId('global_msg')
      .setLabel('Global Leaderboard Messages')
      .setStyle('SECONDARY');
        const row = new Discord.MessageActionRow()
      .addComponents(globalLeaderbordMessage);
        
        
        async function globalMessages() {
        let messages = await message.guild.channels
        var messagesGet = []
        await messages.cache.forEach(async a =>{
          await a.messages.fetch().then(e =>{

            messagesGet.push({ user: e.user.id, messages: e.messages.size})
          })

})
          return messagesGet
}
        async function all() {
        let data = await messagelb
        .find({ guild: message.guild.id })
        let getAll = []
        await data.forEach( async a => {
          getAll.push({
            id: a.id,
            messages: a.Messages
          })
        })
        return getAll
      }
      let msg = message
      let data = await messagelb.findOne({ guild: message.guild.id })
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
        .setAuthor('Top 10 leaderboard berdasarkan pesan', message.guild.iconURL({ dynamic: true}))
        .setDescription(string)
        .setFooter("Pesan dari database Serval")
        msg.channel.send({ embeds: [embed], components: [row]})
       }
      }
      else if (args [0] == "invite" || args[0] == "invites" || args[0] == "Invite" || args[0] == "Invites"){
      let invite = await message.guild.invites.fetch()
      let user = await message.guild.members.fetch()
      
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
          const invitesTotal = await message.guild.members.fetch(i.member)
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
        .setAuthor("Top 10 leaderboard berdasarkan invites", message.guild.iconURL({ dynamic: true}))
        .setDescription(string)
        
      message.channel.send({ embeds: [inviteEmbed]})
}
      else if (args [0] == "level" || args[0] == "Level"){
        let string;
        let noLevel = new Discord.MessageEmbed()
        .setDescription("Belum ada data level saat ini")
        .setColor("RED")
        
        const levelData = await levelSchema.find({ guild: message.guild.id}).sort({ xp: -1, level: -1}).limit(10)
        if(!levelData) return message.channel.send({ embeds: [noLevel]})
        
        for (let count = 0; count < levelData.length; ++count){
          let { id, xp, level } = levelData[count]
          let value = await client.users.fetch(id) || "No data"
          let user = value.id
          
          string += `**${count + 1}.** <@${user}> ▬▬▬ Level: **${level} (${xp} xp)** \n`
        }
        string = string.replace('undefined', '')
         let levelEmbed = new Discord.MessageEmbed()
          .setColor("BLUE")
          .setAuthor("Top 10 leaderboard berdasarkan level", message.guild.iconURL({ dynamic: true}))
          .setDescription(string)
          .setFooter("AERO Team Leaderboard")
          
          message.channel.send({ embeds: [levelEmbed]})
      }
    }
}
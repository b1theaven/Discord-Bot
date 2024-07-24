const Discord = require('discord.js')
const { stripIndents } = require('common-tags')
const messagelb = require('../models/messagelb')
const levelSchema = require('../models/level')
const canvafy = require("canvafy")
module.exports = {
    name: "messageleaderboard",
    cooldown: 5,
    aliases: ["lb"],
    run: async(client, message, args) => {
      let embedChoice = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setAuthor("AERO Team Leaderboard", message.guild.iconURL({ dynamic: true}))
      .addField("a.leaderboard message", "\`Menunjukan top 10 leaderboard berdasarkan pesan\`", true)
      .addField("a.leaderboard invite", "\`Menunjukan top 10 leaderboard berdasarkan invite\`", true)
      .addField("a.leaderboard level", "\`Menunjukan top 10 leaderboard berdasarkan level`", true)
      let choice = ["message", "invite"]
      if(!args[0]) return message.channel.send({ embeds: [embedChoice]})
      if (args[0] === "message" || args[0] === "messages" || args[0] === "msg" || args[0] === "Message" || args[0] === "Messages") {
      const globalLeaderbordMessage = new Discord.MessageButton()
          .setCustomId('global_msg')
          .setLabel('Global Leaderboard Messages')
          .setStyle('SECONDARY');

      const row = new Discord.MessageActionRow()
          .addComponents(globalLeaderbordMessage);

      async function all() {
          let data = await messagelb.find({ guild: message.guild.id });
          let getAll = data.map(a => ({
              id: a.id,
              messages: a.Messages
          }));
          return getAll;
      }

      let msg = message;
      let data = await messagelb.findOne({ guild: message.guild.id });
      if (!data) return msg.channel.send({ content: "Tidak ada data leaderboard saat ini!" });
      else {
          let lb = await all();
          lb.sort((a, b) => b.messages - a.messages);
          let final = lb.slice(0, 10);

          let usersData = await Promise.all(final.map(async (v, index) => {
              const member = await msg.guild.members.fetch(v.id);
              return {
                  top: index + 1,
                  avatar: member.user.displayAvatarURL({ format: 'png', size: 128 }),
                  tag: member.user.username,
                  score: v.messages
              };
          }));

          let imageLeaderboard = await new canvafy.Top()
              .setOpacity(0.3)
              .setScoreMessage("Messages:")
              .setabbreviateNumber(false)
              .setColors({
                  box: '#212121',
                  username: '#ffffff',
                  score: '#ffffff',
                  firstRank: '#f7c716',
                  secondRank: '#9e9e9e',
                  thirdRank: '#94610f'
              })
              .setUsersData(usersData)
              .build();

          const finalImage = new Discord.MessageAttachment(imageLeaderboard, 'leaderboard.png');
          let levelEmbed2 = new Discord.MessageEmbed()
              .setColor("BLUE")
              .setAuthor("Top 10 leaderboard berdasarkan pesan", message.guild.iconURL({ dynamic: true }))
              .setImage('attachment://leaderboard.png')
              .setDescription("Inilah top 10 leaderboard berdasarkan dari pesan")
              .setFooter("AERO Team Leaderboard");

          return msg.channel.send({ embeds: [levelEmbed2], files: [finalImage], components: [row] });
      }
  }
else if (args[0] === "invite" || args[0] === "invites" || args[0] === "Invite" || args[0] === "Invites") {
    let invite = await message.guild.invites.fetch();
    let user = await message.guild.members.fetch();
    
    async function totalInvite() {
        let invites = [];
        await user.forEach(async u => {
            let i = invite.filter(a => a.inviter && a.inviter.id === u.user.id);
            let count = 0;
            i.forEach(m => count += m.uses);
            invites.push({ member: u.user.id, invites: count });
        });
        return invites;
    }

    let inviteLead = await totalInvite();
    inviteLead.sort((a, b) => b.invites - a.invites);
    let final = inviteLead.slice(0, 10);
    
    let usersData = await Promise.all(final.map(async (i, index) => {
        const member = await message.guild.members.fetch(i.member);
        return {
            top: index + 1,
            avatar: member.user.displayAvatarURL({ format: 'png', size: 128 }),
            tag: member.user.username,
            score: i.invites
        };
    }));

    let imageLeaderboard = await new canvafy.Top()
        .setOpacity(0.3)
        .setScoreMessage("Invites:")
        .setabbreviateNumber(false)
        .setColors({
            box: '#212121',
            username: '#ffffff',
            score: '#ffffff',
            firstRank: '#f7c716',
            secondRank: '#9e9e9e',
            thirdRank: '#94610f'
        })
        .setUsersData(usersData)
        .build();

    const finalImage = new Discord.MessageAttachment(imageLeaderboard, 'leaderboard.png');
    let inviteEmbed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor("Top 10 leaderboard berdasarkan invites", message.guild.iconURL({ dynamic: true }))
        .setImage('attachment://leaderboard.png')
        .setDescription("Inilah top 10 leaderboard berdasarkan dari invites")
        .setFooter("AERO Team Leaderboard");

    return message.channel.send({ embeds: [inviteEmbed], files: [finalImage] });
}
      else if (args [0] == "level" || args[0] == "Level"){
        let string;
        let usersData
        let noLevel = new Discord.MessageEmbed()
        .setDescription("Belum ada data level saat ini")
        .setColor("RED")
        
        const levelData = await levelSchema.find({ guild: message.guild.id}).sort({ xp: -1, level: -1}).limit(10)
        if(!levelData) return message.channel.send({ embeds: [noLevel]})
        
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

        string = string.replace('undefined', '')
        console.log(usersData)
        let imageLeaderboard = await new canvafy.Top()
        .setOpacity(0.3)
        .setScoreMessage("Level:")
        .setabbreviateNumber(false)
        .setColors({ box: '#212121', username: '#ffffff', score: '#ffffff', firstRank: '#f7c716', secondRank: '#9e9e9e', thirdRank: '#94610f' })
        .setUsersData(usersData) 
        .build()
        const finalImage = new Discord.MessageAttachment(imageLeaderboard, 'leaderboard.png')
         let levelEmbed2 = new Discord.MessageEmbed()
          .setColor("BLUE")
          .setAuthor("Top 10 leaderboard berdasarkan level", message.guild.iconURL({ dynamic: true}))
          .setImage('attachment://leaderboard.png')
          .setDescription("Inilah top 10 leaderboard berdasarkan dari level")
          .setFooter("AERO Team Leaderboard")
          return message.channel.send({ embeds: [levelEmbed2], files: [finalImage]})
        }
    }
}
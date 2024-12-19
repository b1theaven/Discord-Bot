const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const wait = require("node:timers/promises").setTimeout
module.exports = {
  name: "mod-panel",
  description: "Moderate a user with this panel",
  permission: "MODERATE_MEMBERS",
  options: [
    {

      name: "user",
      description: "Tag a user",
      required: true,
      type: "USER"
   }, 
    {
      name: "reason",
      description: "Reason for your action",
      required: false,
      type: "STRING"
    }

  ],

    execute: async (client, interaction, args) => {
        const {guild, options} = interaction;
        const user = options.getMember("user");
        const reason = options.getString("reason") || "No Reason given";
        
        if(user.roles.cache.has("PUT_YOUR_ROLE_ID")) return interaction.reply({ content: "This user has a role owner", ephemeral: true})
        if(user.roles.cache.has("PUT_YOUR_ROLE_ID")) return interaction.reply({ content: "This user has a role co-owner", ephemeral: true})
        if(user.roles.cache.has("PUT_YOUR_ROLE_ID")) return interaction.reply({ content: "This user has a role admin", ephemeral: true})
      
        if(!user) return interaction.reply({ content: "I can't find this user", ephemeral: true})
        if (user.id === interaction.user.id) {
            return await interaction.reply({
                content: "You cannot moderate yourself!",
                ephemeral: true
            })
        }

        const tRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("1")
            .setLabel("Timeout 5 Minutes")
            .setEmoji("⚠️")
            .setStyle("DANGER"),
            new MessageButton()
            .setCustomId("2")
            .setLabel("Timeout 10 Minutes")
            .setEmoji("⚠️")
            .setStyle("DANGER"),
            new MessageButton()
            .setCustomId("3")
            .setLabel("Timeout 1 Hour")
            .setEmoji("⚠️")
            .setStyle("DANGER"),
        )
        const Row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("kick")
            .setLabel("Kick")
            .setEmoji("🦵")
            .setStyle("DANGER"),
        )

        const embed = new MessageEmbed()
        .setAuthor("Moderator Panel", user.displayAvatarURL({ dynamic: true}))
        .setDescription(`This is the panel to moderate <@${user.id}>!`)
        .addFields(
            {name: "Username:", value: `${user.user.username}`, inline: true},
            {name: "User ID:", value: `${user.id}`, inline: true},
            {name: "User:", value: `<@${user.id}>`, inline: true},
            {name: "Avatar:", value: `[Avatar](${await user.displayAvatarURL()})`, inline: true},
            {name: "Reason:", value: `${reason}`, inline: false}
        )
        .setThumbnail(await user.displayAvatarURL())
        .setTimestamp()

        //const msg = await interaction.reply({
            //embeds: [embed],
       //     components: [Row, tRow]
        //});
      
        //await interaction.deferReply()
        //await wait(1000)
        const embedMSG = await interaction.reply({ embeds: [embed], components: [Row, tRow]})
        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ embedMSG, componentType: "BUTTON", filter, time: 120 * 1000})
        //console.log(collector.options.channel.messages)
        const embed2 = new MessageEmbed()
        .setTimestamp()
        .setFooter(`Admin: ${interaction.user.username}`)

        collector.on('collect', async i => {
          console.log(i)

            if (i.customId === "kick") {
                if (!interaction.guild.me.permissions.has("KICK_MEMBERS")) return await i.reply({ content: "I dont have the permission to **KICK** Members!", ephemeral: true});
              
              
                let err;
                await interaction.guild.members.ban(user, {reason}).catch(e => {
                  err = e
                })
                if(err) return i.reply({ content: "This member has equal or higher power as you so I cannot kick them.", ephemeral: true})
                embed2.setTitle("Kick").setDescription(`You have been kicked in ${i.guild.name}! || **Reason:** ${reason}`)
                const embed3 = new MessageEmbed()
                .setColor("BLUE")
                .setTitle("Kicked!")
                .setDescription(`🔨 <@${user.id}> Has been kicked! || Reason: ${reason} `)
                //await i.update({ embeds: [embed3], components: [], ephemeral: true})
                await user.send({ embeds: [embed2] }).catch(e => console.log(e))

                await i.reply({ embeds: [embed3], ephemeral: true});
            }

            if (i.customId === "1") {
                if (!interaction.guild.me.permissions.has("ADMINISTRATOR")) return await i.reply({ content: "I dont have the permission to **TIMEOUT** Members!", ephemeral: true});
              
              
               
                let err;
                await user.timeout(300000, reason).catch(e => {
                    err = e
                });
                if(err) return i.reply({ content: "This member has equal or higher power as you so I cannot timeout them.", ephemeral: true})
                embed2.setTitle("Timeout").setDescription(`You have been timeouted for **5 Minutes** || **Reason:** ${reason}`);
                const embed3 = new MessageEmbed()
                .setColor("BLUE")
                .setTitle("Timeouted!")
                .setDescription(`⚠️ <@${user.id}> Has been timeouted for **5 Minutes** `)
                //await i.update({ embeds: [embed3], components: [], ephemeral: true})
                await user.send({ embeds: [embed2] })
               
                await i.reply({ embeds: [embed3], ephemeral: true});
            }

            if (i.customId === "2") {
                if (!interaction.guild.me.permissions.has("ADMINISTRATOR")) return await i.reply({ content: "I dont have the permission to **TIMEOUT** Members!", ephemeral: true});
              
              
                let err;
                await user.timeout(600000, reason).catch(e => {
                    err = e
                })
                if(err) return i.reply({ content: "This member has equal or higher power as you so I cannot timeout them.", ephemeral: true})

                embed2.setTitle("Timeout").setDescription(`You have been timeouted for **10 Minutes** || **Reason:** ${reason}`);
                const embed3 = new MessageEmbed()
                .setColor("BLUE")
                .setTitle("Timeouted!")
                .setDescription(`⚠️ <@${user.id}> Has been timeouted for **10 Minutes** `)
                //await i.update({ embeds: [embed3], components: [], ephemeral: true})
                await user.send({ embeds: [embed2] }).catch(err => {
                    return i.reply({ content: "There was an Error sending this user a dm!", ephemeral: true});
                });

                await i.reply({ embeds: [embed3], ephemeral: true});
            }

            if (i.customId === "3") {
                if (!interaction.guild.me.permissions.has("ADMINISTRATOR")) return await i.reply({ content: "I dont have the permission to **TIMEOUT** Members!", ephemeral: true});
              
              
                let err;
                await user.timeout(3600000, reason).catch(e => {
                    err = e
                })
                if(err) return i.reply({ content: "This member has equal or higher power as you so I cannot timeout them.", ephemeral: true})
                embed2.setTitle("Timeout").setDescription(`You have been timeouted for **1 Hour** || **Reason:** ${reason}`);
                const embed3 = new MessageEmbed()
                .setColor("BLUE")
                .setTitle("Banned!")
                .setDescription(`⚠️ <@${user.id}> Has been timeouted for **1 Hour** `)
                //await i.update({ embeds: [embed3], components: [], ephemeral: true})
                await user.send({ embeds: [embed2] }).catch(err => console.log(err))
                await i.reply({ embeds: [embed3], ephemeral: true});
            }
          })
          collector.on("end", async i =>{
            //let embedTimeout = new MessageEmbed()
            embed.setColor("RED")
            embed.setFooter('This panel is invalid')
            await interaction.editReply({ embeds: [embed], components: [] })
          })
    }
}
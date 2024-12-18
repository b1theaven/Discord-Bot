const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require('discord.js')
const levelSchema = require('../../models/level')
const level = require('../../models/level')


module.exports = {
    name: "admin-level",
    description: "Reset / set level user",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: 'user',
            description: "Tag member yang ingin dihitamkan",
            required: true,
            type: "USER"
        }
    ],
    execute: async (client, interaction, args) => {

        const member = interaction.options.getUser("user")
        const user = interaction.options.getMember("user")
        //console.log(member)
        const data = await levelSchema.findOne({ guild: interaction.guild.id, id: member.id })
        if(!data) return interaction.reply({ content: ":x: Tidak dapat menemukan data level user ini", ephemeral: true})
        if(data.level < 1) return interaction.reply({ content: ":x: Level user kurang dari \`1\`", ephemeral: true})

        const resetButton = new MessageButton()
        .setCustomId("reset-btn")
        .setLabel("Reset Level")
        .setEmoji("1275106258441076840")
        .setStyle("PRIMARY")
        const levelButton = new MessageButton()
        .setCustomId("lv-btn")
        .setLabel("Set Level")
        .setEmoji("1275106987390144623")
        .setStyle("SUCCESS")
        
        const row = new MessageActionRow().addComponents(resetButton, levelButton)

        const embed = new MessageEmbed()
        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL( { dynamic: true }))
        .setTitle("Admin Levelling")
        .setColor("GREEN")
        .setDescription("\`\`\`Admin levelling, kamu bisa mengatur sesuka hatimu dengan mereset level user atau menambahkan level kepada user yang kamu tandai\`\`\`")
        .addField("User", `${member.username}`)
        .addField("User ID", `${member.id}`)
        .addField("User Level", `${data.level}`)
        .setTimestamp()


        await interaction.reply({ embeds: [embed], components: [row ]})

        const filter = i => i.user.id === interaction.user.id
        const collector = interaction.channel.createMessageComponentCollector({ componentType: "BUTTON", filter, time: 120 * 1000 })

        collector.on("collect", async i => {
            if(i.customId === "reset-btn") {
                if(!i.member.permissions.has('ADMINISTRATOR')) return i.reply({ content: "Wlee lu ga punya permission admin", ephemeral: true}).catch(e => {})

                const levelData = await levelSchema.findOne({ guild: interaction.guild.id, id: member.id })
                if(!levelData) return i.reply({ content: "Tidak dapat menemukan data level user ini", ephemeral: true}).catch(e => {})
                await levelSchema.deleteMany({ guild: interaction.guild.id, id: member.id })
            //ActiveRole
            if(user.roles.cache.has('PUT_YOUR_ROLE_ID')) {
                 await user.roles.remove('PUT_YOUR_ROLE_ID')
            } else {
                return
            }
            //VeryActiveRole
            if(user.roles.cache.has('PUT_YOUR_ROLE_ID')) {
                await user.roles.remove('PUT_YOUR_ROLE_ID')
            }else{
                return
            }
            //HyperactiveRole
            if(user.roles.cache.has('PUT_YOUR_ROLE_ID')) {
                await user.roles.remove('PUT_YOUR_ROLE_ID')
            }else{
                return
            }
            //SuperActiveRole
            if(user.roles.cache.has('PUT_YOUR_ROLE_ID')) {
                await user.roles.remove('PUT_YOUR_ROLE_ID')
            } else {
                return
            }
                //SuperDuperActiveRole
                if(user.roles.cache.has('PUT_YOUR_ROLE_ID')) {
                await user.roles.remove('PUT_YOUR_ROLE_ID') 
            } else {
                return
            }
            const embed2 = new MessageEmbed()
            .setColor("BLUE")
            .setTitle("Admin Levelling")
            .setDescription("\`\`\`Berhasil mereset level user ini!\`\`\`")
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL( { dynamic: true }))
            .setColor("GREEN")
            .addField("User", `${member.username}`)
            .addField("User ID", `${member.id}`)
            .addField("User Level", `0`)
            .setTimestamp()

            await i.update({ embeds: [embed2], components: [row]})
            }
            if(i.customId === "lv-btn") {
                if(!i.member.permissions.has('ADMINISTRATOR')) return i.reply({ content: "Wlee lu ga punya permission admin", ephemeral: true}).catch(e => {})

                const levelData = await levelSchema.findOne({ guild: interaction.guild.id, id: member.id })
                if(!levelData) return i.reply({ content: "Tidak dapat menemukan data level user ini", ephemeral: true}).catch(e => {}) 

                const select = new MessageSelectMenu()
                .setCustomId("set-level")
                .addOptions([
                    {
                        label: "Set level 5",
                        description: "Set ke level 5",
                        value: 'set-lv5',
                        emoji: "<:Level100:1275106987390144623>"
                    },
                    {
                        label: "Set level 10",
                        description: "Set ke level 10\n++Role @Active",
                        value: 'set-lv10',
                        emoji: "<:Level100:1275106987390144623>"
                    },
                    {
                        label: "Set level 20",
                        description: "Set ke level 20\n++Role @Very Active",
                        value: 'set-lv20',
                        emoji: "<:Level100:1275106987390144623>"
                    },
                    {
                        label: "Set level 30",
                        description: "Set ke level 30\++Role @HyperActive",
                        value: 'set-lv30',
                        emoji: "<:Level100:1275106987390144623>"
                    },
                    {
                        label: "Set level 40",
                        description: "Set ke level 40",
                        value: 'set-lv40',
                        emoji: "<:Level100:1275106987390144623>"
                    },
                    {
                        label: "Set level 50",
                        description: "Set ke level 50\n++Role @Super Active",
                        value: 'set-lv50',
                        emoji: "<:Level100:1275106987390144623>"
                    },
                    {
                        label: "Set level 60",
                        description: "Set ke level 60",
                        value: 'set-lv60',
                        emoji: "<:Level100:1275106987390144623>"
                    },
                    {
                        label: "Set level 70",
                        description: "Set ke level 70\n ++Role @Super-Duper Active",
                        value: 'set-lv70',
                        emoji: "<:Level100:1275106987390144623>"
                    },
                    {
                        label: "Set level 80",
                        description: "Set ke level 80",
                        value: 'set-lv80',
                        emoji: "<:Level100:1275106987390144623>"
                    },
                    {
                        label: "Set level 90",
                        description: "Set ke level 90",
                        value: 'set-lv90',
                        emoji: "<:Level100:1275106987390144623>"
                    },
                    {
                        label: "Set level 100",
                        description: "Set ke level 100",
                        value: 'set-lv100',
                        emoji: "<:Level100:1275106987390144623>"
                    }
                 ])

                 const selectRow = new MessageActionRow().addComponents(select)
                 await i.update({ embeds: [embed], components: [selectRow]})

                 const filter = i => i.user.id === interaction.user.id
                 const collector = interaction.channel.createMessageComponentCollector({ componentType: "SELECT_MENU", filter })

                 collector.on("collect", async i => {
                    const value = i.values[0]
                    if(value === 'set-lv5') {
                        const dataLevel = await level.findOne({ guild: interaction.guild.id, id: member.id })
                        if(!dataLevel) return i.reply({ content: "Data level tidak ditemukan", ephemeral: true}).catch(e => {})
                        dataLevel.level += 5
                        await dataLevel.save()

                        const embedLevelSet5 = new MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL( { dynamic: true }))
                        .setTitle("Admin Levelling")
                        .setColor("GREEN")
                        .setDescription("\`\`\`Level berhasil ditambahkan\`\`\`")
                        .addField("User", `${member.username}`)
                        .addField("User ID", `${member.id}`)
                        .addField("User Level", `${dataLevel.level}`)
                        .setTimestamp()
                        .setFooter("++Level 5")
                        await i.update({ embeds: [embedLevelSet5], components: [row]})
                        collector.stop()

                    }
                    if(value === 'set-lv10') {
                        const dataLevel = await level.findOne({ guild: interaction.guild.id, id: member.id })
                        if(!dataLevel) return i.reply({ content: "Data level tidak ditemukan", ephemeral: true}).catch(e => {})
                        dataLevel.level += 10
                        await dataLevel.save()

                        const embedLevelSet5 = new MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL( { dynamic: true }))
                        .setTitle("Admin Levelling")
                        .setColor("GREEN")
                        .setDescription("\`\`\`Level berhasil ditambahkan\`\`\`")
                        .addField("User", `${member.username}`)
                        .addField("User ID", `${member.id}`)
                        .addField("User Level", `${dataLevel.level}`)
                        .setTimestamp()
                        .setFooter("++Level 10")
                        
                        await i.update({ embeds: [embedLevelSet5], components: [row]})
                        collector.stop()

                    }
                    if(value === 'set-lv20') {
                        const dataLevel = await level.findOne({ guild: interaction.guild.id, id: member.id })
                        if(!dataLevel) return i.reply({ content: "Data level tidak ditemukan", ephemeral: true}).catch(e => {})
                        dataLevel.level += 20
                        await dataLevel.save()

                        const embedLevelSet5 = new MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL( { dynamic: true }))
                        .setTitle("Admin Levelling")
                        .setColor("GREEN")
                        .setDescription("\`\`\`Level berhasil ditambahkan\`\`\`")
                        .addField("User", `${member.username}`)
                        .addField("User ID", `${member.id}`)
                        .addField("User Level", `${dataLevel.level}`)
                        .setTimestamp()
                        .setFooter("++Level 20")
                        
                        await i.update({ embeds: [embedLevelSet5], components: [row]})
                        collector.stop()

                    }
                    if(value === 'set-lv30') {
                        const dataLevel = await level.findOne({ guild: interaction.guild.id, id: member.id })
                        if(!dataLevel) return i.reply({ content: "Data level tidak ditemukan", ephemeral: true}).catch(e => {})
                        dataLevel.level += 30
                        await dataLevel.save()

                        const embedLevelSet5 = new MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL( { dynamic: true }))
                        .setTitle("Admin Levelling")
                        .setColor("GREEN")
                        .setDescription("\`\`\`Level berhasil ditambahkan\`\`\`")
                        .addField("User", `${member.username}`)
                        .addField("User ID", `${member.id}`)
                        .addField("User Level", `${dataLevel.level}`)
                        .setTimestamp()
                        .setFooter("++Level 30")
                        
                        await i.update({ embeds: [embedLevelSet5], components: [row]})
                        collector.stop()

                    }
                    if(value === 'set-lv40') {
                        const dataLevel = await level.findOne({ guild: interaction.guild.id, id: member.id })
                        if(!dataLevel) return i.reply({ content: "Data level tidak ditemukan", ephemeral: true}).catch(e => {})
                        dataLevel.level += 40
                        await dataLevel.save()

                        const embedLevelSet5 = new MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL( { dynamic: true }))
                        .setTitle("Admin Levelling")
                        .setColor("GREEN")
                        .setDescription("\`\`\`Level berhasil ditambahkan\`\`\`")
                        .addField("User", `${member.username}`)
                        .addField("User ID", `${member.id}`)
                        .addField("User Level", `${dataLevel.level}`)
                        .setTimestamp()
                        .setFooter("++Level 40")
                        
                        await i.update({ embeds: [embedLevelSet5], components: [row]})
                        collector.stop()

                    }
                    if(value === 'set-lv50') {
                        const dataLevel = await level.findOne({ guild: interaction.guild.id, id: member.id })
                        if(!dataLevel) return i.reply({ content: "Data level tidak ditemukan", ephemeral: true}).catch(e => {})
                        dataLevel.level += 50
                        await dataLevel.save()

                        const embedLevelSet5 = new MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL( { dynamic: true }))
                        .setTitle("Admin Levelling")
                        .setColor("GREEN")
                        .setDescription("\`\`\`Level berhasil ditambahkan\`\`\`")
                        .addField("User", `${member.username}`)
                        .addField("User ID", `${member.id}`)
                        .addField("User Level", `${dataLevel.level}`)
                        .setTimestamp()
                        .setFooter("++Level 50")
                       
                        await i.update({ embeds: [embedLevelSet5], components: [row]})
                        collector.stop()

                    }
                    if(value === 'set-lv60') {
                        const dataLevel = await level.findOne({ guild: interaction.guild.id, id: member.id })
                        if(!dataLevel) return i.reply({ content: "Data level tidak ditemukan", ephemeral: true}).catch(e => {})
                        dataLevel.level += 60
                        await dataLevel.save()

                        const embedLevelSet5 = new MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL( { dynamic: true }))
                        .setTitle("Admin Levelling")
                        .setColor("GREEN")
                        .setDescription("\`\`\`Level berhasil ditambahkan\`\`\`")
                        .addField("User", `${member.username}`)
                        .addField("User ID", `${member.id}`)
                        .addField("User Level", `${dataLevel.level}`)
                        .setTimestamp()
                        .setFooter("++Level 60")
                        
                        await i.update({ embeds: [embedLevelSet5], components: [row]})
                        collector.stop()

                    }
                    if(value === 'set-lv70') {
                        const dataLevel = await level.findOne({ guild: interaction.guild.id, id: member.id })
                        if(!dataLevel) return i.reply({ content: "Data level tidak ditemukan", ephemeral: true}).catch(e => {})
                        dataLevel.level += 70
                        await dataLevel.save()

                        const embedLevelSet5 = new MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL( { dynamic: true }))
                        .setTitle("Admin Levelling")
                        .setColor("GREEN")
                        .setDescription("\`\`\`Level berhasil ditambahkan\`\`\`")
                        .addField("User", `${member.username}`)
                        .addField("User ID", `${member.id}`)
                        .addField("User Level", `${dataLevel.level}`)
                        .setTimestamp()
                        .setFooter("++Level 70")
                        
                        await i.update({ embeds: [embedLevelSet5], components: [row]})
                        collector.stop()

                    }
                    if(value === 'set-lv80') {
                        const dataLevel = await level.findOne({ guild: interaction.guild.id, id: member.id })
                        if(!dataLevel) return i.reply({ content: "Data level tidak ditemukan", ephemeral: true}).catch(e => {})
                        dataLevel.level += 80
                        await dataLevel.save()

                        const embedLevelSet5 = new MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL( { dynamic: true }))
                        .setTitle("Admin Levelling")
                        .setColor("GREEN")
                        .setDescription("\`\`\`Level berhasil ditambahkan\`\`\`")
                        .addField("User", `${member.username}`)
                        .addField("User ID", `${member.id}`)
                        .addField("User Level", `${dataLevel.level}`)
                        .setTimestamp()
                        .setFooter("++Level 80")
                        
                        await i.update({ embeds: [embedLevelSet5], components: [row]})
                        collector.stop()

                    }
                    if(value === 'set-lv90') {
                        const dataLevel = await level.findOne({ guild: interaction.guild.id, id: member.id })
                        if(!dataLevel) return i.reply({ content: "Data level tidak ditemukan", ephemeral: true}).catch(e => {})
                        dataLevel.level += 90
                        await dataLevel.save()

                        const embedLevelSet5 = new MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL( { dynamic: true }))
                        .setTitle("Admin Levelling")
                        .setColor("GREEN")
                        .setDescription("\`\`\`Level berhasil ditambahkan\`\`\`")
                        .addField("User", `${member.username}`)
                        .addField("User ID", `${member.id}`)
                        .addField("User Level", `${dataLevel.level}`)
                        .setTimestamp()
                        .setFooter("++Level 90")
                  }
                    if(value === 'set-lv100') {
                        const dataLevel = await level.findOne({ guild: interaction.guild.id, id: member.id })
                        if(!dataLevel) return i.reply({ content: "Data level tidak ditemukan", ephemeral: true}).catch(e => {})
                        dataLevel.level += 100
                        await dataLevel.save()

                        const embedLevelSet5 = new MessageEmbed()
                        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL( { dynamic: true }))
                        .setTitle("Admin Levelling")
                        .setColor("GREEN")
                        .setDescription("\`\`\`Level berhasil ditambahkan\`\`\`")
                        .addField("User", `${member.username}`)
                        .addField("User ID", `${member.id}`)
                        .addField("User Level", `${dataLevel.level}`)
                        .setTimestamp()
                        .setFooter("++Level 100")
              
                        await i.update({ embeds: [embedLevelSet5], components: [row]})
                        collector.stop()

                     }
                 })

                 collector.on("end", async i => {
                    await interaction.editReply({ components: []})
                 })
              
              
            }


        })

        collector.on("end", async i =>{
            await interaction.editReply({ components: []}).catch(e => {})
        })

    }
}
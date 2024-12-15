const vipSchema = require("../../models/customrole")
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require("discord.js")
const wait = require("node:timers/promises").setTimeout

module.exports = {
    name: "customrole-gift",
    description: "Memberikan custom role ke seseorang",
    options: [
        {
            name: "user",
            description: "Silahkan pilih user yang ingin di berikan custom role",
            required: true,
            type: "USER"
        }
    ],
    execute: async(client, interaction, args) => {
        const members = await interaction.options.getMember("user")
        if(!interaction.member.premiumSince) return interaction.reply({ content: "Kamu tidak bisa menggunakan command ini", ephemeral: true})
        const acceptButton = new MessageButton()
        .setLabel("Accept")
        .setCustomId("cusrole-acc")
        .setStyle("SUCCESS")
        const declineButton = new MessageButton()
        .setLabel("Decline")
        .setCustomId("cusrole-decline")
        .setStyle("DANGER")
        const vipUser = await vipSchema.findOne({ user: interaction.user.id })
        if(!vipUser) return interaction.reply({ content: "Kamu tidak memiliki custom role", ephemeral: true})
        if(members.user.bot) return interaction.reply({ content: "Kamu tidak bisa memberikannya ke bot", ephemeral: true})
        if(members.user.id === interaction.user.id) return interaction.reply({ content: "Kamu tidak bisa memberikannya ke dirimu sendiri", ephemeral: true})
        const row = new MessageActionRow().addComponents(acceptButton, declineButton)
        await interaction.deferReply()
        await wait(500)
        const msg = await interaction.editReply({ content: `<@${members.user.id}>, Kamu ditawarkan role <@&${vipUser.roles}> oleh ${interaction.member}`, components: [row]})
        const filter = i => i.user.id === members.user.id
        const collector = await msg.createMessageComponentCollector({ componentType: "BUTTON", filter, time: 60*1000})
        
        
        collector.on("collect", async (i) => {
            
            if(i.customId === "acceptButton") {
                await vipSchema.findOne({ user: interaction.user.id}, async (err, data) => {
                    if(data) {
                        if(data.gift.includes(members.user.id)) return interaction.reply({ content: "User ini sudah kamu berikan custom role sebelumnya", ephemeral: true})
                        await data.gift.push(members.user.id)
            }
        })
                await vipUser.save()
                await i.update({ content: `<@${members.user.id}> Telah diberikan role <@&${vipUser.roles}>`, components: []})
                await members.roles.add(vipUser.roles)
            }
            else if(i.customId === "declineButton") {
                await i.update({ content: `${members.user.username}, Menolak penawaran role`, components: []})
            }
        })
        collector.on("end", async (i) => {
            await interaction.editReply({ content: "Tidak ada respon, penawaran dibatalkan", components: []})
        })
    }
}
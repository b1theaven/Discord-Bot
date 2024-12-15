const vipSchema = require("../../models/customrole")
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require("discord.js")
const wait = require("node:timers/promises").setTimeout

module.exports = {
    name: "customrole-gift",
    description: "Memberikan custom role ke seseorang",
    options: [
        {
            name: "attachment",
            description: "Pilih satu gambar yang ingin di set icon",
            required: true,
            type: "ATTACHMENT"
        }
    ],
    execute: async(client, interaction, args) => {
        if(!interaction.member.premiumSince) return interaction.reply({ content: "Kamu tidak bisa menggunakan command ini", ephemeral: true})
        const attachment = await interaction.options.getAttachment('attachment')
        const vipUser = await vipSchema.findOne({ user: interaction.user.id })
        if(!vipUser) return interaction.reply({ content: "Kamu tidak memiliki custom role", ephemeral: true})
        if(attachment) {
            if(attachment.contentType === "video/quicktime") {
                return interaction.reply({ content: ":x: Gambar tidak valid, gambar harus berakhiran \`\`\`jpg, png\`\`\`", ephemeral: true})
          
            } else if(attachment.contentType === 'application/zip') {
                return interaction.reply({ content: ":x: Gambar tidak valid, gambar harus berakhiran \`\`\`jpg, png\`\`\`", ephemeral: true})
        
            }  else if(attachment.contentType === "video/mp4") {
          
                return interaction.reply({ content: ":x: Gambar tidak valid, gambar harus berakhiran \`\`\`jpg, png\`\`\`", ephemeral: true})
            } else if(attachment.contentType === null) {
                return interaction.reply({ content: ":x: Gambar tidak valid, gambar harus berakhiran \`\`\`jpg, png\`\`\`", ephemeral: true})
            } else {
                vipUser.icon = attachment.url
                await vipUser.save()
                }
                await interaction.reply({ content: "Icon telah diset", ephemeral: true})
            }
            
        }
    }
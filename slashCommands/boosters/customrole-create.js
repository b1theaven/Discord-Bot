const vipSchema = require("../../models/customrole")
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require("discord.js")


module.exports = {
    name: "customrole-create",
    description: "Benefit boosters",
    options: [
        {
            name: "name",
            description: "Nama role yang ingin kamu buat",
            required: true,
            type: "STRING"
        },
        { 
            name: "hex_color",
            description: "Warna hex",
            required: false,
            type: "STRING"
        }
    ],
    execute: async(client, interaction, args) => {
        if(!interaction.member.premiumSince) return interaction.reply({ content: "Kamu tidak bisa menggunakan command ini", ephemeral: true})
        const rolesName = await interaction.options.getString("name")
        const rolesColor = await interaction.options.getString("hex_color")
        const vipUser = await vipSchema.findOne({ user: interaction.user.id })
        if(vipUser) {
            return interaction.reply({ content: "Kamu sudah membuat custom roles sebelumnya", ephemeral: true})
        } else {
                const role = await interaction.guild.roles.create({
                    name: rolesName,
                    color: rolesColor || "#a1106c",
                    reason: "Custom role benefit boosters"
                }).catch(e => {
return interaction.reply({ content: "Warna hex tidak valid", ephemeral: true})})
                const boosterRoleId = '912980818371178518';
                const boosterRole = interaction.guild.roles.cache.get(boosterRoleId);
                if (boosterRole) {
                    await role.setPosition(boosterRole.position + 1)
                }
            const createdAt = new Date()
            await vipSchema.create({
                user: interaction.user.id,
                roles: role.id,
                date: `${createdAt.getDate()}/${createdAt.getMonth()+1}/${createdAt.getFullYear()} - ${createdAt.getHours()}:${createdAt.getMinutes()}:${createdAt.getSeconds()} ( EST )`
            })
            await interaction.member.roles.add(role)
            const embed = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor(interaction.member.user.username, interaction.member.user.displayAvatarURL({ dynamic: true }))
            .setDescription("Roles berhasil dibuat")
            .setTimestamp()
            .addField("Role name", `${role.name} ( ${role.id} )`)
            .addField("Role color", rolesColor || "#a1106c")
            .addField("Created at", `${createdAt.getDate()}/${createdAt.getMonth()+1}/${createdAt.getFullYear()} - ${createdAt.getHours()}:${createdAt.getMinutes()}:${createdAt.getSeconds()} ( EST )`)
            await interaction.reply({ embeds: [embed]})
            
        }
    }
}
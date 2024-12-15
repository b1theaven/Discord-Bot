const vipSchema = require("../../models/customrole")
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require("discord.js")

module.exports = {
    name: "customrole",
    description: "Benefit boosters",
    execute: async(client, interaction, args) => {
        if(!interaction.member.premiumSince) return interaction.reply({ content: "Kamu tidak bisa menggunakan command ini", ephemeral: true})
        const vipUser = await vipSchema.findOne({ user: interaction.user.id })
        if(!vipUser) return interaction.reply({ content: "Kamu tidak memiliki custom role", ephemeral: true})
        const customRole = await interaction.guild.roles.cache.get(vipUser.roles)
        const embed = new MessageEmbed()
        .setAuthor(`${interaction.user.globalName ? interaction.user.globalName : interaction.user.username}`, interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription("Hey, ini adalah informasi tentang custom role yang kamu buat, kamu bisa mengedit  atau memberikan role kalian ke orang lain </customrole-gift:1309592361340502027> ")
        .setColor("BLUE")
        .addField("Role", `${customRole} ( ${customRole.name} )`)
        .addField("Role color", `${customRole.hexColor}`)
        .addField("Created at", `${vipUser.date}`)
        .addField("Members", `${customRole.members.map(e => e).join("\n")}`)
        if(vipUser.icon) {
            embed.setImage(vipUser.icon)
            embed.setThumbnail(vipUser.icon)
            
        }
        await interaction.reply({ embeds: [embed]})
        
    }
}
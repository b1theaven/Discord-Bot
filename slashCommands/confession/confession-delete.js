const { MessageEmbed } = require("discord.js")
const confessUser = require("../../models/confessionUser")
const confess = require("../../models/confession")

module.exports = {
    name: "confession-delete",
    description: "Msnghapus pesan confession",
    permission: "MANAGE_SERVERS",
    options: [
        {
            name: "id",
            description: "Id bisa di temukan dibagian author embed contoh 'Anonymous Confession #2'",
            required: true,
            type: "STRING"
        }
    ],
    execute: async(client, interaction, guild) => {
        const { options } = interaction
        const id = options.getString("id")
        const data = await confess.findOne({ guild: interaction.guild.id })
        if(!data) return interaction.reply({ content: ":x: Tidak menemukan data confession di server ini", ephemeral: true})
        
        const channel = await client.channels.cache.get(data.channel)
        const messages = await channel.messages.fetch()
    const sentMessage = messages.find(msg => msg.embeds.length === 1 ? (msg.embeds[0].author && msg.embeds[0].author.name.endsWith(`#${id}`) ? true : false) : false)
        
    
    if(sentMessage) {
        const messageEdit = await channel.messages.fetch(sentMessage.id)
        
        const embed = new MessageEmbed()
        .setColor("PURPLE")
        .setDescription("-# pesan ini telah dihapus oleh admin")
        
        await messageEdit.edit({ embeds: [embed]})
        await interaction.reply({ content: "✅ Berhasil dihapus"})
    }
        
        if(!sentMessage) {
            return interaction.reply({ content: ":x: Tidak dapat menemukan data message", ephemeral: true})
        }


 }
}
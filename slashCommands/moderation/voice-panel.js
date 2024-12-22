const voiceSchema = require("../../models/voiceSchema")
const voicePanel = require("../../models/voicePanel")
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")


module.exports = {
    name: "voice-panel",
    description: "Serval",
    options: [
        {
            name: "channel",
            description: "A text channel",
            type: "CHANNEL",
            channel_types: [0],
            required: true
        }
    ],
    execute: async(client, interaction, args) => {
        
        const channel = interaction.options.getChannel("channel")
        const voiceData = await voiceSchema.findOne({ guild: interaction.guild.id })
        
        if(!voiceData) return interaction.reply({ content: "Fitur blm aktif coek", ephemeral: true})
        
        const embed = new MessageEmbed()
        .setColor("BLUE")
        .setTitle("Serval's Voice Panel")
        .setDescription(`Used to managed your voice channels. You can create your own voice on <#${voiceData.voice}>`)
        .setFooter("Press the buttons below to managed your voice channels")
        .setImage("https://cdn.discordapp.com/attachments/1270001931934236752/1305942511164067871/IMG_1183.jpg?ex=6734dd3d&is=67338bbd&hm=65c8cb62c26abcfa861147b221c88990ef0cb48cb4d270ceb456465a7270c15e&")
        
        const disableButton = new MessageButton()
        .setLabel("Disable")
        .setCustomId(`disable-${voiceData.guild}`)
        .setStyle("SECONDARY")
        .setEmoji("1306121980004536362")
        const lockButton = new MessageButton()
        .setLabel("Lock")
        .setCustomId(`lock-${voiceData.guild}`)
        .setStyle("SECONDARY")
        .setEmoji("1306146261568851999")
        const unlockButton = new MessageButton()
        .setStyle("SECONDARY")
        .setCustomId(`unlock-${voiceData.guild}`)
        .setLabel("Unlock")
        .setEmoji("1306146223874641970")
        const userLimit = new MessageButton()
        .setLabel("Limit")
        .setEmoji("1306121672746598432")
        .setStyle("SECONDARY")
        .setCustomId(`limit-${voiceData.guild}`)
        const rename = new MessageButton()
        .setLabel("Rename")
        .setStyle("SECONDARY")
        .setCustomId(`rename-${voiceData.guild}`)
        .setEmoji("1306147077470031872")
        const kick = new MessageButton()
        .setStyle("SECONDARY")
        .setLabel("Kick")
        .setCustomId(`kick-${voiceData.guild}`)
        .setEmoji("1306146182732714024")
        const invisible = new MessageButton()
        .setStyle("SECONDARY")
        .setLabel("Invisible")
        .setCustomId(`invisible-${voiceData.guild}`)
        .setEmoji("1306124419319595048")
        const visible = new MessageButton()
        .setStyle("SECONDARY")
        .setCustomId(`visible-${voiceData.guild}`)
        .setLabel("Visible")
        .setEmoji("1306124378110431282")
        const channelInfo = new MessageButton()
        .setStyle("SECONDARY")
        .setCustomId(`channelInfo-${voiceData.guild}`)
        .setLabel("Channel Info")
        .setEmoji("1306623153421942864")
        const radio = new MessageButton()
        .setStyle("SECONDARY")
        .setCustomId(`radio-${voiceData.guild}`)
        .setLabel("Radio")
        .setEmoji("1307652036132732959")
        const row = new MessageActionRow().addComponents(rename, userLimit, lockButton, unlockButton, visible)
        const row2 = new MessageActionRow().addComponents(invisible, kick, channelInfo, radio, disableButton)
        
        client.channels.cache.get(channel.id).send({ embeds:  [embed], components: [row, row2]}).then(async eid => {
            await voicePanel.create({
                guild: interaction.guild.id,
                channel: channel.id,
                messageID: eid.id
            })
        })
        await interaction.reply({ content: "✅ Sudah di set", ephemeral: true})
    }
}
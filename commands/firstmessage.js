const { MessageEmbed } = require('discord.js')


module.exports = {
    name: "firstmessage",
    description: "Get a first messages on channel",
    cooldown: 5,
    run: async(client, message, args) => {

        const firstMessages = await message.channel.messages.fetch({ after: 1, limit: 1})
        const fetchMessages = firstMessages.first()
        console.log(fetchMessages)
        
        let content = fetchMessages.content
        
        content.replace("@", "1")


        const embed = new MessageEmbed()
        .setAuthor(fetchMessages.author.username, fetchMessages.author.displayAvatarURL({ dynamic: true }))
        .setColor("BLUE")
        .setDescription(`[${fetchMessages.content.replace("@", "1") ? fetchMessages.content : "Embed/Attachment"}](${fetchMessages.url})`)
        .addField("Message Content", fetchMessages.content.replace("@", "1") ? fetchMessages.content.replace("@", "1") : "Embed/Attachment")
        .addField("Author", fetchMessages.author.username)
        .addField("Created At", `<t:${Math.round(fetchMessages.createdTimestamp / 1000)}>`)
        .setTimestamp()
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        message.channel.send({ embeds: [embed] })
    }
}
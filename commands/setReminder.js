const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'setreminder',
    aliases: ['reminder', 'remind'],
    run: async (client, msg, args) => {
        if (!msg.member.permissions.has('ADMINISTRATOR')) {
            return msg.channel.send({ content: "You do not have the required permissions to use this command." });
        }

        const [channelMention, intervalTime, ...messageContent] = args;
        const interval = parseInt(intervalTime);

        if (!channelMention || !interval || !messageContent.length) {
            return msg.channel.send({ content: "Format: `a.setreminder <#channel> <interval_in_hours> <message>`" });
        }

        const targetChannel = msg.mentions.channels.first();
        if (!targetChannel) {
            return msg.channel.send({ content: "Please mention a valid channel." });
        }

        const reminderMessage = messageContent.join(' ');

        // Convert interval time from hours to milliseconds
        const intervalInMs = interval * 60 * 60 * 1000;

        // Set the interval to send the message
        setInterval(() => {
            targetChannel.send({ content: reminderMessage });
        }, intervalInMs);

        const embed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('Reminder Set')
            .setDescription(`A reminder has been set to send the following message every ${interval} hour(s) in ${targetChannel}:\n\n${reminderMessage}`);

        msg.channel.send({ embeds: [embed] });
    }
};
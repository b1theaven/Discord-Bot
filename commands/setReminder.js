const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
const lang = require('../language'); // Pastikan path ini benar sesuai dengan struktur folder Anda

const remindersFile = path.resolve(__dirname, '../reminders.json');
const reminders = new Map(); // Map to store interval IDs

// Load existing reminders from the JSON file
function initializeReminders(client) {
    if (fs.existsSync(remindersFile)) {
        const data = JSON.parse(fs.readFileSync(remindersFile, 'utf8'));
        for (const [channelID, reminder] of Object.entries(data)) {
            const remainingTime = reminder.timestamp + reminder.interval - Date.now();
            const intervalID = setTimeout(() => {
                const channel = client.channels.cache.get(channelID);
                if (channel) {
                    channel.send({ content: reminder.message });
                }
                // Set interval to repeat the message
                const repeatID = setInterval(() => {
                    if (channel) {
                        channel.send({ content: reminder.message });
                    }
                }, reminder.interval);
                reminders.set(channelID, repeatID);
            }, remainingTime > 0 ? remainingTime : 0);
            reminders.set(channelID, intervalID);
        }
    }
}

module.exports = {
    name: 'setreminder',
    aliases: ['reminder', 'remind'],
    run: async (client, msg, args) => {
        if (!msg.member.permissions.has('ADMINISTRATOR')) {
            return msg.channel.send(lang(msg.guild, "INTERACTION_PERMISSION"));
        }

        const [channelMention, intervalTime, ...messageContent] = args;
        const interval = parseInt(intervalTime) * 60 * 60 * 1000; // Convert hours to milliseconds

        if (!channelMention || isNaN(interval) || !messageContent.length) {
            return msg.channel.send({ content: "Format: `a.setreminder <#channel> <interval_in_hours> <message>`" });
        }

        const targetChannel = msg.mentions.channels.first();
        if (!targetChannel) {
            return msg.channel.send(lang(msg.guild, "MENTION_CHANNEL"));
        }

        const reminderMessage = messageContent.join(' ');

        // Set the interval to send the message and store the interval ID
        const intervalID = setInterval(() => {
            targetChannel.send({ content: reminderMessage });
        }, interval);

        reminders.set(targetChannel.id, intervalID);

        // Save the reminder to the JSON file with a timestamp
        let savedReminders = {};
        if (fs.existsSync(remindersFile)) {
            savedReminders = JSON.parse(fs.readFileSync(remindersFile, 'utf8'));
        }
        savedReminders[targetChannel.id] = { interval, message: reminderMessage, timestamp: Date.now() };
        fs.writeFileSync(remindersFile, JSON.stringify(savedReminders, null, 4));

        const embed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(lang(msg.guild, "REMINDER_SET"))
            .setDescription(`A reminder has been set to send the following message every ${intervalTime} hour(s) in ${targetChannel}:\n\n${reminderMessage}`);

        msg.channel.send({ embeds: [embed] });
    },
    reminders,
    initializeReminders
};

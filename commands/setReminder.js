const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
const lang = require('../language'); // Pastikan path ini benar sesuai dengan struktur folder Anda

const databaseFile = path.resolve(__dirname, '../reminders.json');
const reminders = new Map(); // Map to store interval IDs

// Load existing reminders from the JSON file
function loadReminders(client) {
    if (fs.existsSync(databaseFile)) {
        const data = JSON.parse(fs.readFileSync(databaseFile, 'utf8'));
        if (data.setReminders) {
            for (const [channelID, reminder] of Object.entries(data.setReminders)) {
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

        if (!channelMention || !interval || !messageContent.length) {
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

        // Load existing database
        let database = { setReminders: {}, remindMe: [] };
        if (fs.existsSync(databaseFile)) {
            database = JSON.parse(fs.readFileSync(databaseFile, 'utf8'));
        }

        // Ensure setReminders object exists
        if (typeof database.setReminders !== 'object' || database.setReminders === null) {
            database.setReminders = {};
        }

        // Save the reminder to the JSON file with a timestamp
        database.setReminders[targetChannel.id] = { interval, message: reminderMessage, timestamp: Date.now() };
        fs.writeFileSync(databaseFile, JSON.stringify(database, null, 4));

        const embed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(lang(msg.guild, "REMINDER_SET"))
            .setDescription(`A reminder has been set to send the following message every ${intervalTime} hour(s) in ${targetChannel}:\n\n${reminderMessage}`);

        msg.channel.send({ embeds: [embed] });
    },
    loadReminders
};

module.exports.reminders = reminders;
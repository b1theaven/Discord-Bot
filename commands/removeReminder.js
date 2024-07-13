const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { reminders } = require('./setReminder');
const lang = require('../language');

const remindersFile = path.resolve(__dirname, '../remindserver.json');

module.exports = {
    name: 'removereminder',
    aliases: ['removeremind', 'delremind'],
    run: async (client, msg, args) => {
        if (!msg.member.permissions.has('ADMINISTRATOR')) {
            return msg.channel.send(lang(msg.guild, "INTERACTION_PERMISSION"));
        }

        const channelMention = args[0];
        const targetChannel = msg.mentions.channels.first();

        if (!channelMention || !targetChannel) {
            return msg.channel.send({ content: "Format: `a.removereminder <#channel>`" });
        }

        const intervalID = reminders.get(targetChannel.id);

        if (!intervalID) {
            return msg.channel.send({ content: "No reminder set for this channel." });
        }

        clearInterval(intervalID);
        reminders.delete(targetChannel.id);

        // Remove the reminder from the JSON file
        const savedReminders = JSON.parse(fs.readFileSync(remindersFile, 'utf8') || '{}');
        delete savedReminders[targetChannel.id];
        fs.writeFileSync(remindersFile, JSON.stringify(savedReminders));

        const embed = new MessageEmbed()
            .setColor('RED')
            .setTitle(lang(msg.guild, "REMINDER_REMOVED"))
            .setDescription(`The reminder for ${targetChannel} has been removed.`);

        msg.channel.send({ embeds: [embed] });
    }
};

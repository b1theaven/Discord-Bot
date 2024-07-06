const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const schedule = require('node-schedule');
const moment = require('moment-timezone');

module.exports = {
    name: 'remindme',
    description: 'Set a reminder at a specific date and time in the specified timezone (WIB, WITA, WIT).',
    usage: '<date> <time> <timezone> <message>',
    run: async (client, msg, args) => {
        if (args.length < 4) return msg.reply({ content: "Format: `a.remindme <date = YYYY-MM-DD> <time = HH:MM> <timezone = WIB / WITA / WIT> <message>`" });

        const dateStr = args[0];
        const timeStr = args[1];
        const timezone = args[2].toUpperCase();
        const reminderMsg = args.slice(3).join(' ');

        let tz;
        switch (timezone) {
            case 'WIB':
                tz = 'Asia/Jakarta';
                break;
            case 'WITA':
                tz = 'Asia/Makassar';
                break;
            case 'WIT':
                tz = 'Asia/Jayapura';
                break;
            default:
                return msg.reply('Invalid timezone. Please use WIB, WITA, or WIT.');
        }

        const dateTimeStr = `${dateStr} ${timeStr}`;
        const reminderDate = moment.tz(dateTimeStr, 'YYYY-MM-DD HH:mm', tz).toDate();

        if (isNaN(reminderDate)) {
            return msg.reply('Invalid date or time format. Please use YYYY-MM-DD for date and HH:MM for time.');
        }

        console.log(`Setting reminder for ${msg.author.tag} at ${reminderDate} (${timezone})`);

        schedule.scheduleJob(reminderDate, () => {
            msg.author.send(`🔔 Reminder: ${reminderMsg}`)
                .then(() => console.log(`Reminder sent to ${msg.author.tag}`))
                .catch(err => console.log(`Could not send reminder DM to ${msg.author.tag}: ${err}`));
        });

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Reminder Set")
            .setDescription(stripIndents`
                **Date:** ${dateStr}
                **Time:** ${timeStr} ${timezone}
                **Message:** ${reminderMsg}
            `);

        msg.channel.send({ embeds: [embed] });
    }
};

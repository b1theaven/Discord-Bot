const fs = require('fs');
const Discord = require('discord.js');

const REMINDERS_FILE = './reminduser.json';

module.exports = {
    name: 'listreminder',
    description: 'List all reminders with details',
    run: async (client, message, args) => {
        const reminders = getReminders();

        if (reminders.length === 0) {
            return message.reply('There are no reminders set.');
        }

        // Filter reminders by user ID
        const userReminders = reminders.filter(reminder => reminder.userId === message.author.id);

        if (userReminders.length === 0) {
            return message.reply('You have no reminders set.');
        }

        // Prepare embed message
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Your Reminders')
            .setDescription('List of reminders you have set:')
            .setTimestamp();

        // Add each reminder as a field in the embed
        userReminders.forEach(reminder => {
            embed.addField(`ID: ${reminder.id}`, `**Time:** ${reminder.time}\n**Message:** ${reminder.message}`);
        });

        // Send the embed message to the user
        message.channel.send({ embeds: [embed] });
    }
};

function getReminders() {
    if (!fs.existsSync(REMINDERS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(REMINDERS_FILE);
    return JSON.parse(data);
}

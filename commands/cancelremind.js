const fs = require('fs');

const REMINDERS_FILE = './reminduser.json';

module.exports = {
    name: 'cancelremind',
    description: 'Cancel a reminder',
    run: async (client, message, args) => {
        // Mengecek apakah jumlah argumen mencukupi
        if (args.length < 1) {
            return message.reply('Usage: a.cancelremind <reminder_id>');
        }

        const reminderId = args[0];

        const reminders = getReminders();
        const reminderIndex = reminders.findIndex(reminder => reminder.id === reminderId);

        if (reminderIndex === -1) {
            return message.reply(`Reminder with ID ${reminderId} not found.`);
        }

        const canceledReminder = reminders.splice(reminderIndex, 1)[0];
        saveReminders(reminders);

        message.reply(`Canceled reminder with ID ${reminderId}:\n${canceledReminder.message}`);
    }
};

function saveReminders(reminders) {
    fs.writeFileSync(REMINDERS_FILE, JSON.stringify(reminders, null, 2));
}

function getReminders() {
    if (!fs.existsSync(REMINDERS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(REMINDERS_FILE);
    return JSON.parse(data);
}
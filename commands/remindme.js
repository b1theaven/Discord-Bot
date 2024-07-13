const moment = require('moment-timezone');
const fs = require('fs');

const REMINDERS_FILE = './reminduser.json';

module.exports = {
    name: 'remindme',
    description: 'Set a reminder',
    run: async (client, message, args) => {
        // Mengecek apakah jumlah argumen mencukupi
        if (args.length < 3) {
            return message.reply('Usage: a.remindme <YYYY-MM-DD> <HH:mm> <WIB|WITA|WIT> <message>');
        }

        const date = args.shift(); // mengambil tanggal
        const time = args.shift(); // mengambil waktu
        const zone = args.shift().toUpperCase(); // mengambil zona waktu
        const reminderMessage = args.join(' '); // mengambil pesan pengingat

        const timeZones = {
            'WIB': 'Asia/Jakarta',
            'WITA': 'Asia/Makassar',
            'WIT': 'Asia/Jayapura'
        };

        // Validasi timezone
        if (!timeZones.hasOwnProperty(zone)) {
            return message.reply('Invalid timezone. Use one of the following: WIB, WITA, WIT');
        }

        // Validasi format waktu
        const dateTime = `${date} ${time}`;
        const reminderTime = moment.tz(dateTime, 'YYYY-MM-DD HH:mm', timeZones[zone]);
        if (!reminderTime.isValid()) {
            return message.reply('Invalid date/time format. Use YYYY-MM-DD HH:mm format.');
        }

        // Generate unique ID for reminder
        const reminderId = generateReminderId();

        // Hitung durasi timeout dari sekarang hingga waktu reminder
        const now = moment();
        const timeoutDuration = reminderTime.diff(now);

        // Set timeout untuk mengirimkan pesan pengingat
        setTimeout(() => {
            // Kirim pesan pengingat ke DM pengguna
            message.author.send(`🔔 Reminder: ${reminderMessage}`);

            // Hapus reminder dari database setelah pesan terkirim
            deleteReminder(reminderId);
        }, timeoutDuration);

        const reminder = {
            id: reminderId,
            userId: message.author.id,
            time: reminderTime.toISOString(),
            zone,
            message: reminderMessage,
            channelId: message.channel.id
        };

        saveReminder(reminder);
        message.reply(`Reminder set with ID ${reminderId} for ${reminderTime.format('YYYY-MM-DD HH:mm')} ${zone} with message: "${reminderMessage}"`);
    }
};

function generateReminderId() {
    return Math.random().toString(36).substr(2, 9); // Generate a random alphanumeric ID
}

function saveReminder(reminder) {
    const reminders = getReminders();
    reminders.push(reminder);
    fs.writeFileSync(REMINDERS_FILE, JSON.stringify(reminders, null, 2));
}

function deleteReminder(reminderId) {
    let reminders = getReminders();
    reminders = reminders.filter(reminder => reminder.id !== reminderId);
    fs.writeFileSync(REMINDERS_FILE, JSON.stringify(reminders, null, 2));
}

function getReminders() {
    if (!fs.existsSync(REMINDERS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(REMINDERS_FILE);
    return JSON.parse(data);
}
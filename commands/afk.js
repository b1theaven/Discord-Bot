const fs = require('fs');
const path = require('path');
const afkFilePath = path.join(__dirname, '../afk.json');
const lang = require('../language');

function loadAfkData() {
  if (!fs.existsSync(afkFilePath)) {
    fs.writeFileSync(afkFilePath, JSON.stringify({}));
  }
  const rawData = fs.readFileSync(afkFilePath);
  return JSON.parse(rawData);
}

function saveAfkData(data) {
  fs.writeFileSync(afkFilePath, JSON.stringify(data, null, 2));
}

module.exports = {
  name: 'afk',
  description: 'Set your AFK status with a custom message.',
  run: async (client, message, args) => {
    const afkData = loadAfkData();
    const afkMessage = args.join(' ') || 'I am AFK';

    afkData[message.author.id] = {
      message: afkMessage,
      username: message.member.displayName
    };

    saveAfkData(afkData);

    try {
      await message.member.setNickname(`[AFK] ${message.member.displayName}`);
      message.reply(lang(message.guild, 'AFK').replace('%s', afkMessage));
    } catch (error) {
      if (error.code === 50013) {
        message.reply(lang(message.guild, 'BOT_PERMISSIONS'));
      } else {
        console.error(error);
      }
    }
  }
};
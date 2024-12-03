const fs = require('fs');
const path = require('path');
const afkFilePath = path.join(__dirname, 'afk.json');
const afkSchema = require("../models/afk")
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
      
      if(afkMessage.includes("@everyone") || afkMessage.includes("@here")) return message.reply("You can't use that")

    afkData[message.author.id] = {
      message: afkMessage,
      username: message.member.displayName
    };

    saveAfkData(afkData);

    try {
        await afkSchema.findOneAndUpdate(
            {
            id: message.author.id },
            { message: afkMessage,
            timestamp: Date.now() },
            { upsert: true }
        )
      message.reply(`You are now AFK: ${afkMessage}`);
       // await message.member.setNickname(`[AFK] ${message.member.displayName}`)
    } catch (error) {
      if (error.code === 50013) {
        message.reply('I do not have permission to change your nickname.');
      } else {
        console.error(error);
      }
    }
  }
};
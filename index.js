const Discord = require("discord.js");
const fs = require("fs");
const path = require('path')
const REMINDERS_FILE = './reminders.json';
const moment = require('moment-timezone');
const remindMe = require('./commands/remindme');
const setReminder = require('./commands/setReminder');
const giveawayCommand = require('./commands/giveaway');
const ms = require('ms');
const client = new Discord.Client({ intents: 32767 });
const { DiscordBanners } = require('discord-banners');
const discordBanners = new DiscordBanners(client);
const mongoose = require("mongoose");
const { HYPIXEL, mongodburl} = require('./config.json');
const Hypixel = require("hypixel-api-reborn");
const hy = new Hypixel.Client("12");
client.hypixel = hy;
client.util = require("./util.js");
const { get } = require("node-superfetch");
const DBL = require("dblapi.js");
const dbl = new DBL("DBL_API", client);
client.dbl = dbl;
const { readdirSync } = require("fs");
const express = require("express");
const app = express();
const prefixSchema = require('./models/prefix');
let messageLb = require('./models/messagelb')
const { loadLanguages } = require("./language");
const { GoogleGenerativeAI } = require('@google/generative-ai')
const langSchema = require("./models/language");
const lang = require("./language");
const levelSchema = require("./models/level");
const dataPath = path.join(__dirname, 'boosters.json');
const { Client, Intents, MessageActionRow, Collection, MessageButton, MessageEmbed, Events, Permissions } = require("discord.js");
const TICKET_CATEGORY_ID = 'PUT_YOUR_CHANNEL_ID'; // Ganti dengan ID kategori untuk tiket
const TICKET_LOG_CHANNEL_ID = 'PUT_YOUR_CHANNEL_ID'; // Ganti dengan ID channel log tiket
let boosterData = { boosters: {} };

const axios = require("axios")
const urls = [""]
setInterval(function() {
            urls.forEach(url => {
            axios.get(url).then(console.log("Pong at " + Date.now())).catch(() => {});
        })
    }, 60 * 1000);
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};

app.get("/", (req, res) => {
  res.sendStatus(200);
});
app.listen(process.env.PORT || 3000);

setInterval(() => {
  loadLanguages(client);
  console.log("Load all guild languages");
}, 300 * 1000);

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    giveawayCommand.scheduleGiveaways(client);
    setReminder.loadReminders(client);
});

client.on("ready", async () => {
    console.log("Online " + client.user.tag);
    client.user.setActivity(`AERO Team Official Bot`);
    loadLanguages(client);
    await mongoose.connect(mongodburl, mongoOptions);
    console.log("Connected to mongodb");
  
});

client.snipes = new Map();
const activeTickets = new Map();

// Read the data from the JSON file
if (fs.existsSync(dataPath)) {
    try {
        const rawData = fs.readFileSync(dataPath, 'utf8');
        boosterData = JSON.parse(rawData);
    } catch (error) {
        console.error('Error reading data file:', error);
    }
} else {
    fs.writeFileSync(dataPath, JSON.stringify(boosterData, null, 2));
}

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    try {
        const oldBoostTimestamp = oldMember.premiumSinceTimestamp;
        const newBoostTimestamp = newMember.premiumSinceTimestamp;

        if (oldBoostTimestamp !== newBoostTimestamp) {
            // User started boosting the server
            const thankYouChannelId = 'PUT_YOUR_CHANNEL_ID'; // Ganti dengan ID channel yang diinginkan
            const thankYouChannel = newMember.guild.channels.cache.get(thankYouChannelId);

            if (thankYouChannel) {
                const embed = new MessageEmbed()
                    .setColor('#FFD700')
                    .setTitle('Terima Kasih telah boosting server ini!')
                    .setDescription(`Terima kasih ${newMember} telah boosting server! Anda mendapatkan kesempatan untuk membuat custom role. Gunakan perintah \`a.rolecreate <nama> <warna>\` untuk membuat role.`)
                    .setThumbnail(newMember.guild.iconURL({ dynamic: true }));

                await thankYouChannel.send({ embeds: [embed] });
            }

            // Initialize booster data if not exists
            if (!boosterData.boosters[newMember.id]) {
                boosterData.boosters[newMember.id] = {
                    hasCustomRole: false,
                    roleInfo: null,
                    givenTo: null
                };
                fs.writeFileSync(dataPath, JSON.stringify(boosterData, null, 2));
            }
        } else if (oldMember.premiumSince && !newMember.premiumSince) {
            // User stopped boosting the server
            const booster = boosterData.boosters[oldMember.id];
            if (booster && booster.hasCustomRole) {
                const role = oldMember.guild.roles.cache.get(booster.roleInfo.roleId);
                if (role) {
                    await role.delete('User stopped boosting');
                }
                delete boosterData.boosters[oldMember.id];
                fs.writeFileSync(dataPath, JSON.stringify(boosterData, null, 2));
            }
        }
    } catch (error) {
        console.error('Error handling guildMemberUpdate event:', error);
    }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  let levelData = await levelSchema.findOne({ guild: message.guild.id, id: message.author.id });

  if (!levelData) {
      levelData = await levelSchema.create({ guild: message.guild.id, id: message.author.id, xp: 0, level: 0 });
  }

  const xpGive = 1;
  const xpRequire = levelData.level * levelData.level * 20 + 20;

  if (levelData.xp + xpGive >= xpRequire) {
      levelData.xp += xpGive;
      levelData.level += 1;
      await levelData.save();

      if (!message.channel) return;
      if(levelData.level == 10) {
          //ActiveRole
          if(message.member.roles.cache.has('PUT_YOUR_ROLE_ID')) return;
          else await message.member.roles.add('PUT_YOUR_ROLE_ID')
      }
      if(levelData.level == 20) {
          //VeryActiveRole
          if(message.member.roles.cache.has('PUT_YOUR_ROLE_ID')) return;
          else await message.member.roles.add('PUT_YOUR_ROLE_ID')
      }
      if(levelData.level == 30) {
          //HyperactiveRole
          if(message.member.roles.cache.has('PUT_YOUR_ROLE_ID')) return;
          else await message.member.roles.add('PUT_YOUR_ROLE_ID')
      }if(levelData.level == 50) {
          //SuperActiveRole
          if(message.member.roles.cache.has('PUT_YOUR_ROLE_ID')) return;
          else await message.member.roles.add('PUT_YOUR_ROLE_ID')
      }
      if(levelData.level == 75) {
          //SuperDuperActiveRole
          if(message.member.roles.cache.has('PUT_YOUR_ROLE_ID')) return;
          else await message.member.roles.add('PUT_YOUR_ROLE_ID')
      }
      const channelLevel = "PUT_YOUR_CHANNEL_ID"
      let levelEmbed = new Discord.MessageEmbed()
          .setColor("GREEN")
          .setDescription(`<@${message.author.id}>, selamat, kamu naik level ${levelData.level}!`);
      client.channels.cache.get(channelLevel).send({ content: `<@${message.author.id}> selamat kamu telah naik ke level **${levelData.level}.**`})
      //message.channel.send({ embeds: [levelEmbed] });
  } else {
      levelData.xp += xpGive;
      await levelData.save();
  }
//
//
//
const messageData = await messageLb.findOne({ guild : message.guild.id, id: message.author.id });
if(!messageData) {
  await messageLb.create({ guild: message.guild.id, id: message.author.id, Messages: 1});
} else {
  const messageUp = messageData.Messages + 1;
  await messageLb.findOneAndUpdate({ guild: message.guild.id, id: message.author.id }, { Messages: messageUp}, { upsert: true });
}
  
 let data = await messageLb.findOne({ guild : message.guild.id, id: message.author.id })
if(!data) {
  
  let newData = await messageLb.create({ guild: message.guild.id, id: message.author.id, Messages: 1})
} else {
  var messageUp = await data.Messages + 1;
  await messageLb.findOneAndUpdate({ guild: message.guild.id, id: message.author.id }, { Messages: messageUp}, { upsert: true })
}

  const afkFilePath = path.join(__dirname, 'afk.json');
  const afkData = JSON.parse(fs.readFileSync(afkFilePath));

  // Check if user is AFK and remove AFK status
  if (afkData[message.author.id]) {
    const { username } = afkData[message.author.id];
    try {
      await message.member.setNickname(username);
      delete afkData[message.author.id];
      fs.writeFileSync(afkFilePath, JSON.stringify(afkData, null, 2));

      const replyMessage = await message.reply('You are no longer AFK.');
      setTimeout(() => {
        replyMessage.delete().catch(console.error);
      }, 3000); // 3 seconds
    } catch (error) {
      if (error.code === 50013) {
        message.reply('I do not have permission to change your nickname.');
      } else {
        console.error(error);
      }
    }
  }

  // Check for mentions and respond if mentioned user is AFK
  message.mentions.users.forEach(user => {
    if (afkData[user.id]) {
      message.reply(`${user.username} is AFK: ${afkData[user.id].message}`);
    }
  });
 
  if (message.content === 'a.ticket') {
  const row = new MessageActionRow()
  .addComponents(
  new MessageButton()
  .setCustomId('create_ticket')
  .setLabel('💎 Buat Tiket')
  .setStyle('PRIMARY'),
  );

  const embed = new MessageEmbed()
  .setColor('#00FF00')
  .setTitle('Buat Tiket')
  .setDescription('Klik tombol di bawah ini untuk membuat tiket baru.');

  await message.channel.send({ embeds: [embed], components: [row] });
  }
});

function getReminders() {
    if (!fs.existsSync(REMINDERS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(REMINDERS_FILE);
    return JSON.parse(data);
}

function checkReminders() {
    setInterval(() => {
        const now = moment();
        const reminders = getReminders();
        const toRemove = [];

        reminders.forEach((reminder, index) => {
            const reminderTime = moment(reminder.time);
            if (now.isSameOrAfter(reminderTime)) {
                const channel = client.channels.cache.get(reminder.channelId);
                if (channel) {
                    channel.send(`<@${reminder.userId}> Reminder: ${reminder.message}`);
                }
                toRemove.push(index);
            }
        });

        if (toRemove.length > 0) {
            const updatedReminders = reminders.filter((_, index) => !toRemove.includes(index));
            fs.writeFileSync(REMINDERS_FILE, JSON.stringify(updatedReminders, null, 2));
        }
    }, 60000); // Check every minute
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'create_ticket') {
        if (activeTickets.has(interaction.user.id)) {
            return interaction.reply({ content: 'Anda sudah memiliki tiket yang belum ditutup. Harap tutup tiket tersebut sebelum membuat tiket baru.', ephemeral: true });
        }

        const ticketChannel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
            type: 'GUILD_TEXT',
            parent: TICKET_CATEGORY_ID,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
            ],
        });

        activeTickets.set(interaction.user.id, ticketChannel.id);

        const memberCount = interaction.guild.memberCount;

        const ticketEmbed = new MessageEmbed()
            .setColor('#00FF00')
            .setTitle('Tiket Dibuat')
            .setDescription(`Tiket Anda telah dibuat: ${ticketChannel}`)
            .setTimestamp();

        await interaction.reply({ embeds: [ticketEmbed], ephemeral: true });

        const closeRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('close_ticket')
                    .setLabel('⛔ Tutup Tiket')
                    .setStyle('DANGER'),
            );

        const welcomeMessage = await ticketChannel.send({
            content: `Selamat datang <@${interaction.user.id}>! Selamat berbelanja! Klik tombol dibawah jika ingin menutup tiketnya ya~`,
            components: [closeRow],
        });

        // Menambahkan reaksi otomatis
    } else if (interaction.customId === 'close_ticket') {
        const channel = interaction.channel;
        if (!channel.name.startsWith('ticket-')) {
            return interaction.reply({ content: 'Ini bukan channel tiket!', ephemeral: true });
        }

        const logChannel = client.channels.cache.get(TICKET_LOG_CHANNEL_ID);
        if (logChannel) {
            const closeEmbed = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle('Tiket Ditutup')
                .setDescription(`Tiket ditutup oleh <@${interaction.user.id}>`)
                .setTimestamp();

            await logChannel.send({ embeds: [closeEmbed] });
        }

        const ticketOwnerId = Array.from(activeTickets.keys()).find(key => activeTickets.get(key) === channel.id);
        if (ticketOwnerId) {
            activeTickets.delete(ticketOwnerId);
        }

        await interaction.reply({ content: 'Tiket ini akan ditutup dalam 5 detik.', ephemeral: true });
        setTimeout(() => {
            channel.delete().catch(err => console.error('Failed to delete channel:', err));
        }, 5000);
    }
      try {
        if (interaction.isCommand()) {
          if (interaction.commandName === 'ping') {
            return interaction.reply({ content: `Pong! ${client.ws.ping}ms` });
          }
          const cmd = client.slashCommands.get(interaction.commandName);
          if (!cmd) return interaction.reply({ content: "Something Went Wrong", ephemeral: true });

          if (cmd.permission) {
            const authorPerms = interaction.channel.permissionsFor(interaction.member);
            if (!authorPerms || !authorPerms.has(cmd.permission)) {
              const permEmbed = new Discord.MessageEmbed()
                .setColor("BLUE")
                .setDescription(lang(interaction.guild, "INTERACTION_PERMISSION") + " " + cmd.permission);
              return interaction.reply({ embeds: [permEmbed], ephemeral: true });
            }
          }
          if (cmd.ownerOnly) {
            if (!['PUT_YOUR_DISCORD_ID'].includes(interaction.member.id)) {
              return interaction.reply({ content: 'Owner only', ephemeral: true });
            }
          }
          const args = [];
          for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
              if (option.name) args.push(option.name);
              option.options?.forEach((x) => {
                if (x.value) args.push(x.value);
              });
            } else if (option.value) args.push(option.value);
          }
         const commands = await cmd.execute(client, interaction, args);
        }
      } catch (err) {
         const cmd = client.slashCommands.get(interaction.commandName);
         const ch = "PUT_YOUR_CHANNEL_ID"
           const errEmbed2 = new MessageEmbed()
           .setTitle("Command butuh perbaikan segera")
           .setDescription("Sistem mendeteksi adanya error pada command "+"\`"+cmd.name+"\`")
           .addField("Error Stack", `\`${messageLimit(err.stack)}\``, true)
           .addField("Error Message", `\`${messageLimit(err.message)}\``, true)
           .setFooter("Error Logging")
     interaction.reply({ content: "Maaf, terjadi kesalahan saat menjalankan perintah"})
             client.channels.cache.get(ch).send({ embeds: [errEmbed2]})
        console.log("Something Went Wrong => ", err);
      }
});

client.on("guildCreate", async(guild) => {
  loadLanguages(client);
});

// Message Delete Logging
client.on('messageDelete', function (message, channel){
    client.snipes.set(message.channel.id, message, {
    content: message.content,
    author: message.author,
    image: message.attachments.first()
      ? message.attachments.first().proxyURL
      : null
  })
  const logChannel = client.channels.cache.get('PUT_YOUR_CHANNEL_ID');
  if (!logChannel) return;

  // Tambahkan pengecekan apakah pesan tersebut dihapus oleh bot sendiri
  if (message.author.bot) return;

  const embed = new MessageEmbed()
    .setTitle('<:no_entry_sign:885195095840804885> Message Deleted')
    .setColor('RED')
    .addField('\`Author\`', message.author.tag, true)
    .addField('\`Channel\`', message.channel.name, true)
    .addField('\`Content\`', message.content || 'Embed/Attachment', true)
    .setTimestamp();

  logChannel.send({ embeds: [embed] });
})

// Message Update Logging
client.on('messageUpdate', (oldMessage, newMessage) => {
  if (oldMessage.content === newMessage.content) return;
  const logChannel = client.channels.cache.get('PUT_YOUR_CHANNEL_ID');
  if (!logChannel) return;

  const embed = new MessageEmbed()
    .setTitle('<:hammer:885195095840804885> Message Edited')
    .setColor('YELLOW')
    .addField('\`Author\`', oldMessage.author.tag, true)
    .addField('\`Channel\`', oldMessage.channel.name, true)
    .addField('\`Before\`', oldMessage.content || 'Embed/Attachment', true)
    .addField('\`After\`', newMessage.content || 'Embed/Attachment', true)
    .setTimestamp();

  logChannel.send({ embeds: [embed] });
});

// Voice State Update Logging
client.on('voiceStateUpdate', (oldState, newState) => {
  const logChannel = client.channels.cache.get('PUT_YOUR_CHANNEL_ID');
  if (!logChannel) return;

  if (oldState.channelId !== newState.channelId) {
    if (!oldState.channelId) {
      const embed = new MessageEmbed()
        .setTitle('<:sound:885195095840804885> Member Joined Voice Channel')
        .setColor('GREEN')
        .addField('\`Member\`', newState.member.user.tag, true)
        .addField('\`Channel\`', newState.channel.name, true)
        .setTimestamp();

      logChannel.send({ embeds: [embed] });
    } else if (!newState.channelId) {
      const embed = new MessageEmbed()
        .setTitle('<:mute:885195095840804885> Member Left Voice Channel')
        .setColor('RED')
        .addField('\`Member\`', oldState.member.user.tag, true)
        .addField('\`Channel\`', oldState.channel.name, true)
        .setTimestamp();

      logChannel.send({ embeds: [embed] });
    } else {
      const embed = new MessageEmbed()
        .setTitle('<:sound:885195095840804885> Member Moved Voice Channel')
        .setColor('YELLOW')
        .addField('\`Member\`', oldState.member.user.tag, true)
        .addField('\`From\`', oldState.channel.name, true)
        .addField('\`To\`', newState.channel.name, true)
        .setTimestamp();

      logChannel.send({ embeds: [embed] });
    }
  }
});

client.banners = discordBanners;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.cooldown = new Discord.Collection();
client.events = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.commands = new Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.log(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    console.log("Successfully loaded " + file);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
    if (props.aliases) {
      props.aliases.forEach(alias => {
        client.aliases.set(alias, props);
      });
    }
  });
});

fs.readdir('./events/', (err, files) => {
  if (err) console.log(err);
  files.forEach(file => {
    let eventFunc = require(`./events/${file}`);
    console.log("Successfully loaded " + file);
    let eventName = file.split(".")[0];
    client.on(eventName, (...args) => eventFunc.run(client, ...args));
  });
});

const handlers = readdirSync("./handler/").filter((f) => f.endsWith(".js"));

handlers.forEach((handler) => {
  require(`./handler/${handler}`)(client);
});

client.login(process.env.TOKEN);

module.exports.client = client;

function messageLimit(str) {
  if (str.length > 1000) {
      return str.substring(0, 1001) + '...';
  } else {
      return str;
  }
}
const Discord = require("discord.js");
const fs = require("fs");
const path = require('path')
const canvafy = require('canvafy')
const { WelcomeLeave } = require("canvafy")
const REMINDERS_FILE = './reminders.json';
const moment = require('moment-timezone');
const global = require("./global.js")
const setReminder = require('./commands/setReminder');
const giveawayCommand = require('./commands/giveaway');
const ms = require('ms');
const client = new Discord.Client({ intents: 32767, partials: ["MESSAGE", "CHANNEL", "REACTION"]});
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
const reactionRole = require("./models/reactionrole")
const backgroundBuffer = new MessageAttachment('./images.jpg', 'images.png')
const dataPath = path.join(__dirname, 'boosters.json');
const neko = require("nekos.life")
const nekoClient = new neko()
const { Client, Intents, MessageActionRow, Collection, MessageButton, MessageEmbed, Events, Permissions } = require("discord.js");
const TICKET_CATEGORY_ID = 'PUT_YOUR_CHANNEL_ID'; // Ganti dengan ID kategori untuk tiket
const TICKET_LOG_CHANNEL_ID = 'PUT_YOUR_CHANNEL_ID'; // Ganti dengan ID channel log tiket
const WELCOME_CHANNEL_ID = 'PUT_YOUR_CHANNEL_ID';
const LEAVE_CHANNEL_ID = 'PUT_YOUR_CHANNEL_ID';
const GUILD_ID = 'PUT_YOUR_GUILD_ID';
const ALL_MEMBERS_CHANNEL_ID = 'ALL_MEMBERS_CHANNEL_ID';
const MEMBERS_CHANNEL_ID = 'MEMBERS_CHANNEL_ID';
const BOT_CHANNEL_ID = 'BOT_CHANNEL_ID';
let boosterData = { boosters: {} };
client.neko = nekoClient

const axios = require("axios")
const urls = [""]
setInterval(function() {
  urls.forEach(url => {
  axios.get(url).then(global.debug("Pong at " + Date.now())).catch(() => {});
})
}, 90 * 1000);
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
  global.success("Load all guild languages");
}, 300 * 1000);

client.once('ready', () => {
    global.info(`Logged in as ${client.user.tag}!`);
    giveawayCommand.scheduleGiveaways(client);
    setReminder.loadReminders(client);
});

client.on("ready", async () => {
  global.success("Online " + client.user.tag);
  client.user.setActivity(`AERO Team Official Bot`);
  loadLanguages(client);
  await mongoose.connect(mongodburl, mongoOptions);
  global.success("Connected to mongodb");
  const guild = client.guilds.cache.get(GUILD_ID);
  if (guild) {
      await updateChannelNames(guild);
  }
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

client.on("messageReactionAdd", async(react, user) => {

  if(react.message.partial) await react.message.fetch()
  if(react.partial)await react.fetch()
  
  if(!react.message.guildId) return
  if(user.bot) return
  
  let emojiID = `<:${react.emoji.name}:${react.emoji.id}>`
  if(!react.emoji.id) {
    emojiID = react.emoji.name
  }
  
  
  const reactData = await reactionRole.findOne({ guild: react.message.guildId, message: react.message.id, emoji: emojiID})
  
  if(!reactData) return
  
  const guild = await client.guilds.cache.get(react.message.guildId)
  const member = await guild.members.cache.get(user.id)
  
  try { 
  
    const embed = new MessageEmbed()
    .setColor("GREEN")
    .setDescription(`✅ I have added a role <@&${reactData.role}> to ${member}`)
    await member.roles.add(reactData.role)
    await react.message.reply({ embeds: [embed]}).then(m => setTimeout(() => m.delete(), 5000))
  } catch(e) {
    console.log(e)
    console.log(reactData.role)
  }

})

client.on("messageReactionRemove", async(react, user) => {
  
  if(react.message.partial) await react.message.fetch
  if(react.partial) await react.fetch()
  
  
  if(!react.message.guildId) return
  if(user.bot) return
  
  let emojiID = `<:${react.emoji.name}:${react.emoji.id}>`
  if(!react.emoji.id) {
    emojiID = react.emoji.name
  }
  
  
  const reactData = await reactionRole.findOne({ guild: react.message.guildId, message: react.message.id, emoji: emojiID})
  
  if(!reactData) return
  
  const guild = await client.guilds.cache.get(react.message.guildId)
  const member = await guild.members.cache.get(user.id)
  
  try { 
  
    const embed = new MessageEmbed()
    .setColor("ORANGE")
    .setDescription(`✅ I have removed a role <@&${reactData.role}> from ${member}`)
    await member.roles.remove(reactData.role)
    await react.message.reply({ embeds : [embed]}).then(m => setTimeout(() => m.delete(), 5000))
  } catch(e) {
    console.log(e)
    console.log(reactData.role)
  }

})

client.on('guildMemberAdd', async member => {
  await updateChannelNames(member.guild);
      const welcomeImage = await new canvafy.WelcomeLeave()
          .setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: "png" }))
          setBackground("image", backgroundBuffer)
          .setTitle(`${member.user.username}`)
          .setDescription("Welcome to the server", "#FFFFFF")
          .setBorder(getRandomColor())
          .setAvatarBorder(getRandomColor())
          .setOverlayOpacity(0.3)
          .build();
      

      const attachment = new MessageAttachment(welcomeImage, `welcome-${member.id}.png`);

      const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
      if (!channel) {
          console.error("Welcome channel not found.");
          return;
      }

      await channel.send({
          content: `Welcome to this server, ${member}! go read the rules please <#881207788922101823>!`,
          files: [attachment]
      });

   })

client.on('guildMemberRemove', async member => {
  await updateChannelNames(member.guild);
  try {
      const leaveImage = await new canvafy.WelcomeLeave()
          .setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: "png" }))
          .setBackground("image", backgroundBuffer)
          .setTitle(`${member.user.username}`)
          .setDescription("Time to say goodbye, my friend!", "#FFFFFF")
          .setBorder(getRandomColor())
          .setAvatarBorder(getRandomColor())
          .setOverlayOpacity(0.3)
          .build();
     const leaveBuffer2 = new Discord.MessageAttachment(leaveImage, "leave-image.png")
      // Verifikasi apakah leaveImage adalah buffer yang valid
     if (!leaveImage2) {
          console.error("Failed to create leave image.");
          return;
      }
      

      const attachment = new MessageAttachment(leaveImage, `leave-${member.id}.png`);
      const channel = member.guild.channels.cache.get(LEAVE_CHANNEL_ID);
      if (!channel) {
          console.error("Leave channel not found.");
          return;
      }

      channel.send({
          content: `Bye-bye, ${member}!`,
          files: [leaveBuffer2]
      });

  } catch (error) {
      console.error("Error in guildMemberAdd event:", error);
  }
});

async function updateChannelNames(guild) {
  try {
    const allMembersChannel = guild.channels.cache.get(ALL_MEMBERS_CHANNEL_ID);
    const membersChannel = guild.channels.cache.get(MEMBERS_CHANNEL_ID);
    const botChannel = guild.channels.cache.get(BOT_CHANNEL_ID);
    
    if (!allMembersChannel || !membersChannel || !botChannel) return;

    const allMembersCount = guild.memberCount;
    const membersCount = guild.members.cache.filter(member => !member.user.bot).size;
    const botCount = guild.members.cache.filter(member => member.user.bot).size;

    await allMembersChannel.setName(`🌐 ║All Members: ${allMembersCount}`);
    await membersChannel.setName(`👥 ║Members: ${membersCount}`);
    await botChannel.setName(`👾 ║Bots: ${botCount}`);
  } catch (error) {
        console.error('Error updating channel names:', error);
  }
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

const userXpIntervals = new Map();

client.on('voiceStateUpdate', async (oldState, newState) => {
  const userId = newState.id;
  const guildId = newState.guild.id;
  const xpGive = Math.floor(Math.random() * 124) * 3;

  // Logging voice state changes
  const logChannel = client.channels.cache.get('PUT_YOUR_CHANNEL_ID');
  if (logChannel && oldState.channelId !== newState.channelId) {
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

  // Leveling and XP gain logic
  if (newState.channel && !oldState.channel) {
    if (userXpIntervals.has(userId)) {
      clearInterval(userXpIntervals.get(userId));
    }

    const xpInterval = setInterval(async () => {
      let levelData = await levelSchema.findOne({ guild: guildId, id: userId });

      if (!levelData) {
        levelData = new levelSchema({
          guild: guildId,
          id: userId,
          xp: xpGive,
          level: 1
        });
      } else {
        levelData.xp += xpGive;

        const xpNeeded = levelData.level * levelData.level * 100 + 100;

        if (levelData.xp + xpGive >= xpNeeded) {
          levelData.xp -= xpNeeded;
          levelData.level += 1;
          await levelData.save();

          if (!newState.channel) return;

          const roleIdMap = {
            10: 'PUT_YOUR_ROLE_ID',
            20: 'PUT_YOUR_ROLE_ID',
            30: 'PUT_YOUR_ROLE_ID',
            50: 'PUT_YOUR_ROLE_ID',
            75: 'PUT_YOUR_ROLE_ID',
          };

          if (roleIdMap[levelData.level]) {
            const roleId = roleIdMap[levelData.level];
            const role = newState.guild.roles.cache.get(roleId);
            if (role && !newState.member.roles.cache.has(roleId)) {
              await newState.member.roles.add(role);
            }
          }

          const channelLevel = "PUT_YOUR_CHANNEL_ID";
          const levelEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`<@${newState.member.id}>, selamat, kamu telah naik level ke ${levelData.level}!`);
          client.channels.cache.get(channelLevel).send({ content: `<@${newState.member.id}> selamat kamu telah naik ke level **${levelData.level}**!` });
        } else {
          await levelData.save();
        }
      }

      if (!newState.channel) {
        clearInterval(xpInterval);
        userXpIntervals.delete(userId);
      }
    }, 50000);

    userXpIntervals.set(userId, xpInterval);
  }

  if (!newState.channel && oldState.channel) {
    if (userXpIntervals.has(userId)) {
      clearInterval(userXpIntervals.get(userId));
      userXpIntervals.delete(userId);
    }
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  let levelData = await levelSchema.findOne({ guild: "PUT_YOUR_GUILD_ID", id: message.author.id });

  if (!levelData) {
      levelData = await levelSchema.create({ guild: "PUT_YOUR_GUILD_ID", id: message.author.id, xp: 0, level: 0 });
  }

  const xpGive = Math.floor(Math.random() * 23) + 1;
  const xpRequire = levelData.level * levelData.level * 100 + 100;

  if (levelData.xp + xpGive >= xpRequire) {
      levelData.xp += 5;
      levelData.level += 1;
      await levelData.save();

      if (!message.channel) return;
      if(levelData.level == 10) {
          if(message.member.roles.cache.has('PUT_YOUR_ROLE_ID')) return;
          else await message.member.roles.add('PUT_YOUR_ROLE_ID')
      }
      if(levelData.level == 20) {
          if(message.member.roles.cache.has('PUT_YOUR_ROLE_ID')) return;
          else await message.member.roles.add('PUT_YOUR_ROLE_ID')
      }
      if(levelData.level == 30) {
          if(message.member.roles.cache.has('PUT_YOUR_ROLE_ID')) return;
          else await message.member.roles.add('PUT_YOUR_ROLE_ID')
      }if(levelData.level == 50) {
          if(message.member.roles.cache.has('PUT_YOUR_ROLE_ID')) return;
          else await message.member.roles.add('PUT_YOUR_ROLE_ID')
      }
      if(levelData.level == 75) {
          if(message.member.roles.cache.has('PUT_YOUR_ROLE_ID')) return;
          else await message.member.roles.add('PUT_YOUR_ROLE_ID')
      }
      const channelLevel = "PUT_YOUR_CHANNEL_ID"
      let levelEmbed = new Discord.MessageEmbed()
          .setColor("GREEN")
          .setDescription(`<@${message.author.id}>, selamat kamu naik level ${levelData.level}!`);
      client.channels.cache.get(channelLevel).send({ content: `<@${message.author.id}> selamat! Kamu telah naik ke level **${levelData.level}**!`})
  } else {
      levelData.xp += xpGive;
      await levelData.save();
  }

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
      }, 3000);
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
    }, 60000);
}

client.on('interactionCreate', async interaction => {
  try {
    // Handle Slash Commands
    if (interaction.isCommand()) {
      if (interaction.commandName === 'ping') {
        return interaction.reply({ content: `Pong! ${client.ws.ping}ms` });
      }

      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd) return interaction.reply({ content: "Something Went Wrong", ephemeral: true });

      // Permission Check
      if (cmd.permission) {
        const authorPerms = interaction.channel.permissionsFor(interaction.member);
        if (!authorPerms || !authorPerms.has(cmd.permission)) {
          const permEmbed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setDescription(lang(interaction.guild, "INTERACTION_PERMISSION") + " " + cmd.permission);
          return interaction.reply({ embeds: [permEmbed], ephemeral: true });
        }
      }

      // Owner Only Check
      if (cmd.ownerOnly) {
        if (!['671351376642834440', '1005082777206661190', '627027667685867530', '465491570305662978'].includes(interaction.member.id)) {
          return interaction.reply({ content: 'Owner only', ephemeral: true });
        }
      }

      // Parse Arguments
      const args = [];
      for (let option of interaction.options.data) {
        if (option.type === "SUB_COMMAND") {
          if (option.name) args.push(option.name);
          option.options?.forEach((x) => {
            if (x.value) args.push(x.value);
          });
        } else if (option.value) args.push(option.value);
      }

      // Execute Command
      cmd.execute(client, interaction, args);

    // Handle Button Interactions
    } else if (interaction.isButton()) {
      const command = client.commands.get(interaction.customId.split('_')[0]);

      if (command && command.buttonExecute) {
        try {
          await command.buttonExecute(interaction);
        } catch (error) {
          console.error(error);
          await interaction.reply({ content: 'There was an error while processing this action!', ephemeral: true });
        }
      }

      // Create Ticket Interaction
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

        await ticketChannel.send({
          content: `Selamat datang <@${interaction.user.id}>! Klik tombol di bawah untuk menutup tiket.`,
          components: [closeRow],
        });

      // Close Ticket Interaction
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
    }
  } catch (err) {
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
  console.log(message.attachments.size)
  let image = message.attachments.first();;
  let embed = new MessageEmbed()
    .setTitle('<:no_entry_sign:885195095840804885> Message Deleted')
    .setColor('RED')
    .addField('\`Author\`', message.author.tag, true)
    .addField('\`Channel\`', message.channel.name, true)
    .addField('\`Content\`', message.content || 'Embed/Attachment', true)
    .setTimestamp();
    if(message.attachments.size > 0) embed.setImage(image.url ? image.proxyURL : null)

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

client.banners = discordBanners;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.cooldown = new Discord.Collection();
client.events = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.commands = new Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) return global.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    global.success("Successfully loaded " + file);
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
    global.success("Successfully loaded " + file);
    let eventName = file.split(".")[0];
    client.on(eventName, (...args) => eventFunc.run(client, ...args));
  });
});

const handlers = readdirSync("./handler/").filter((f) => f.endsWith(".js"));

handlers.forEach((handler) => {
  require(`./handler/${handler}`)(client);
});

// Error handling
const channelCrash = "PUT_YOUR_CHANNEL_ID"
  process.on("unhandledRejection", (reason, p) => {
    const embed = new Discord.MessageEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true}))
    .setColor("YELLOW")
    .setFooter("Anti Crash")
    .setTimestamp()
    .addField("Serval Anti Crash", "\`\`\`Unhandled Rejection/Catch\`\`\`")
    .addField("Reason", `\`\`\`${messageLimit(reason)}\`\`\``)
    console.log(" [antiCrash] :: Unhandled Rejection/Catch");
    client.channels.cache.get("1269726419127242842").send({ embeds: [embed]})
    console.log(reason, p);
  });
  process.on("uncaughtException", (err, origin) => {
    const embed = new Discord.MessageEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
    .setColor("YELLOW")
    .setTimestamp()
    .setFooter("Anti Crash")
    .addField("Serval Anti Crash", "\`\`\`Uncaught Exception/Catch\`\`\`")
    .addField("Error", `\`\`\`${messageLimit(err)}\`\`\``)
    .addField("Error Message", `\`\`\`${messageLimit(err.message)}\`\`\``)
    client.channels.cache.get("1269726419127242842").send({ embeds: [embed]})
    console.log(" [antiCrash] :: Uncaught Exception/Catch");
    console.log(err, origin);
  });
  process.on("uncaughtExceptionMonitor", (err, origin) => {
      
    const embed = new Discord.MessageEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
    .setColor("YELLOW")
    .addField("Serval Anti Crash (Monitor)", "\`\`\`Uncautht Exception/Catch (Monitor)\`\`\`")
    .setFooter("Anti Crash")
    .addField("Error", `\`\`\`${messageLimit(err)}\`\`\``)
    .addField("Error Message", `\`\`\`${messageLimit(err.message)}\`\`\``)
    .setTimestamp()
    client.channels.cache.get("1269726419127242842").send({ embeds: [embed]})
    console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
    console.log(err, origin);
  });
  process.on("multipleResolves", (type, promise, reason) => {
    console.log(" [antiCrash] :: Multiple Resolves");
  });

process.on("uncaughtReferenceError", (err) => {
      
    const embed = new Discord.MessageEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true}))
    .setColor("YELLOW")
    .setTimestamp()
    .setFooter("Anti Crash")
    .addField("Serval Anti Crash", `\`\`\`Uncaught Reference Error\`\`\``)
    .addField("Error Stack", `\`\`\`${messageLimit(err.stack)}\`\`\``)
    .addField("Error Message", `\`\`\`${messageLimit(err.message)}\`\`\``)
    client.channels.cache.get("1269726419127242842").send({ embeds: [embed]})
    console.log(" [antiCrash] :: Uncaught Reference Error");
  });

client.login(process.env.TOKEN);

module.exports.client = client;

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function messageLimit(str) {
  if (str.length > 1000) {
      return str.substring(0, 1001) + '...';
  } else {
      return str;
  }
}
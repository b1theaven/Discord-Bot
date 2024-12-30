const Discord = require("discord.js");
const fs = require("fs");
const path = require('path')
const blacklist2 = require("./models/blacklist")
const afkSchema = require("./models/afk")
const { Client, Intents, MessageActionRow, Collection, MessageButton, MessageAttachment, MessageEmbed, Events, Permissions } = require("discord.js");
const global = require("./global.js")
const canvafy = require('canvafy');
const { WelcomeLeave } = require('canvafy');
const REMINDERS_FILE = './reminders.json';
const moment = require('moment-timezone');
const starboardSchema = require('./models/starboard')
const remindMe = require('./commands/remindme');
const defaultbackground = "https://images.wallpapersden.com/image/download/fantasy-castle-pixel-art_bW1uaWuUmZqaraWkpJRmbmdlrWZlbWY.jpg"
const backgroundBuffer = new MessageAttachment('./images.jpg', 'images.png')
const setReminder = require('./commands/setReminder');
const giveawayCommand = require('./commands/giveaway');
const ms = require('ms');
const {stripIndents} = require("common-tags")
const client = new Discord.Client({ intents: 32767, partials: ["MESSAGE", "CHANNEL", "REACTION"] });
const { DiscordBanners } = require('discord-banners');
const discordBanners = new DiscordBanners(client);
const mongoose = require("mongoose");
const { HYPIXEL, mongodburl} = require('./config.json');
const neko = require("nekos.life")
const nekoClient = new neko()
client.util = require("./util.js");
const { get } = require("node-superfetch");
const DBL = require("dblapi.js");
const dbl = new DBL("DBL_TOKEN", client);
client.dbl = dbl;
const { readdirSync } = require("fs");
const express = require("express");
const app = express();
const prefixSchema = require('./models/prefix');
let messageLb = require('./models/messagelb')
const { loadLanguages } = require("./language");
const { GoogleGenerativeAI } = require('@google/generative-ai')
const NAME = "rizky"
const langSchema = require("./models/language");
const lang = require("./language");
const levelSchema = require("./models/level");
const dataPath = path.join(__dirname, 'boosters.json');
const TICKET_CATEGORY_ID = 'PUT_YOUR_CHANNEL_ID';
const TICKET_LOG_CHANNEL_ID = 'PUT_YOUR_CHANNEL_ID';
const WELCOME_CHANNEL_ID = 'PUT_YOUR_CHANNEL_ID';
const LEAVE_CHANNEL_ID = 'PUT_YOUR_CHANNEL_ID';
const GUILD_ID = 'PUT_YOUR_GUILD_ID';
const ALL_MEMBERS_CHANNEL_ID = 'PUT_YOUR_CHANNEL_ID';
const MEMBERS_CHANNEL_ID = 'PUT_YOUR_CHANNEL_ID';
const BOT_CHANNEL_ID = 'PUT_YOUR_CHANNEL_ID';
const { loadReactionRoles, saveReactionRoles } = require('./util/string');
let boosterData = { boosters: {} };
client.neko = nekoClient
const reactionRole = require("./models/reactionrole")
const axios = require("axios")
const urls = ["https://fern-colossal-socks.glitch.me", "https://neighborly-tough-hyacinth.glitch.me"]
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
      const channelChat = await client.channels.cache.get("PUT_YOUR_CHANNEL_ID")
      await channelChat.send({ content: `Selamat datang, ${member}! Sering-sering nimbrung disini ya biar aktif. Oh iya jangan lupa buat claim role di <#PUT_YOUR_CHANNEL_ID> ya`}).then(d => setTimeout(() => d.delete(), 60*1000))
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
const channelSent2 = "PUT_YOUR_CHANNEL_ID"
const ch = client.channels.cache.get('channelSent2')
client.on("ready", async () => {
    client.user.setActivity(`AERO Team Official Bot`);
    loadLanguages(client);
    await mongoose.connect(mongodburl, mongoOptions);
    const guild = client.guilds.cache.get(GUILD_ID);
    if (guild) {
        updateChannelNames(guild);
    }
})

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

client.on('guildMemberAdd', async member => {
    await updateChannelNames(member.guild);
        const welcomeImage = await new canvafy.WelcomeLeave()
            .setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: "png" }))
            //.setBackground("image", backgroundBuffer)
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
            content: `Welcome to this server, ${member}! go read the rules please <#PUT_YOUR_CHANNEL_ID>!`,
            files: [attachment]
        });

     })

client.on('guildMemberRemove', async member => {
    await updateChannelNames(member.guild);
    try {
        const leaveImage = await new canvafy.WelcomeLeave()
            .setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: "png" }))
            //.setBackground("image", backgroundBuffer)
            .setTitle(`${member.user.username}`)
            .setDescription("Time to say goodbye, my friend!", "#FFFFFF")
            .setBorder(getRandomColor())
            .setAvatarBorder(getRandomColor())
            .setOverlayOpacity(0.3)
            .build();
       const leaveBuffer2 = new Discord.MessageAttachment(leaveImage, "leave-image.png")
        // Verifikasi apakah leaveImage adalah buffer yang valid
       // if (!leaveImage2) {
            //console.error("Failed to create leave image.");
            //return;
       // }
        

        const attachment = new MessageAttachment(leaveImage, `leave-${member.id}.png`);
        const channel = member.guild.channels.cache.get(LEAVE_CHANNEL_ID);
        //if (!channel) {
            //console.error("Leave channel not found.");
            //return;
        //}

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
                let boostCount = client.guilds.cache.get('PUT_YOUR_GUILD_ID').premiumSubscriptionCount
                const embed = new MessageEmbed()
                    .setColor('#FFD700')
                    .setTitle('Terima Kasih telah boosting server ini!')
                    .setDescription(stripIndents`
**AERO TEAM** sekarang memiliki **${boostCount}** boosts!

Terima kasih ${newMember} telah boosting server! Anda mendapatkan kesempatan untuk membuat custom role. Gunakan perintah \`a.role create <nama> <warna>\` untuk membuat role.`)
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

  if (newState.channel && !oldState.channel) {
    if (userXpIntervals.has(userId)) {
      clearInterval(userXpIntervals.get(userId));
    }

    // Buat interval baru untuk menambah XP
    const xpInterval = setInterval(async () => {
      let levelData = await levelSchema.findOne({ guild: "PUT_YOUR_GUILD_ID", id: userId });

      if (!levelData) {
        levelData = new levelSchema({
          guild: "PUT_YOUR_GUILD_ID",
          id: userId,
          xp: xpGive,
          level: 1
        });
      } else {
        levelData.xp += xpGive;

        const xpNeeded = levelData.level * levelData.level * 100 + 100

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
            .setDescription(`<@${userId}>, selamat, kamu telah naik level ke ${levelData.level}!`);
          client.channels.cache.get(channelLevel).send({ content: `<@${userId}> selamat kamu telah naik ke level **${levelData.level}**!`})

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
        levelData = await levelSchema.create({ guild: "PUT_YOUR_GUILD_ID", id: message.author.id, xp: 0, level: 0});
    }

    //const xpGiveRandom = Math.floor(Math.random() * 6) + 1
    const xpGive = Math.floor(Math.random() * 609) * 3;
    const coinsGive = Math.floor(Math.random() * 90) * 2;
    const xpRequire = levelData.level * levelData.level * 100 + 100;

    if (levelData.xp + xpGive >= xpRequire) {
        //levelData.xp -= xpRequire;
        levelData.xp = 0
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
            .setDescription(`<@${message.author.id}>, selamat, kamu telah naik level ke ${levelData.level}!`);
        client.channels.cache.get(channelLevel).send({ content: `<@${message.author.id}> selamat kamu telah naik ke level **${levelData.level}**!`})
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
  
    const command = client.commands.get(interaction.customId.split('_')[0]);

    if (command && command.buttonExecute) {
      try {
        await command.buttonExecute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while processing this action!', ephemeral: true });
      }
    }

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
});

client.on('interactionCreate', async interaction => {
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
        if (!['PUT_YOUR_ACCOUNT_ID'].includes(interaction.member.id)) {
          return interaction.reply({ content: 'Owner only', ephemeral: true });
        }
      }
        const blacklist = await blacklist2.findOne({ id: interaction.member.id})
        if(blacklist) {
            if(blacklist.id.includes(interaction.member.id)) return interaction.reply({ content: "Lu udah blacklist oleh admin", ephemeral: true})
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
      cmd.execute(client, interaction, args);
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
  if (message.author && message.author.bot) return;
 console.log(message.attachments.size)
  let image = message.attachments.first();;
  let embed = new MessageEmbed()
    .setTitle('<:no_entry_sign:885195095840804885> Message Deleted')
    .setColor('RED')
    .addField('\`Author\`', message.author.tag || "Unknown", true)
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
    .addField('\`Author\`',
              `${oldMessage.author ? oldMessage.author.username: "Unknown"}`, true)
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
        .addField('\`Member\`', newState.member.user && newState.member.user.username, true)
        .addField('\`Channel\`', newState.channel.name, true)
        .setTimestamp();

      logChannel.send({ embeds: [embed] });
    } else if (!newState.channelId) {
      const embed = new MessageEmbed()
        .setTitle('<:mute:885195095840804885> Member Left Voice Channel')
        .setColor('RED')
        .addField('\`Member\`', oldState.member.user.tag || "Unknown", true)
        .addField('\`Channel\`', oldState.channel.name, true)
        .setTimestamp();

      logChannel.send({ embeds: [embed] });
    } else {
      const embed = new MessageEmbed()
        .setTitle('<:sound:885195095840804885> Member Moved Voice Channel')
        .setColor('YELLOW')
        .addField('\`Member\`', oldState.member.user.tag || "Unknown", true)
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

// error handling
const channelCrash = "PUT_YOUR_CHANNEL_ID"
  process.on("unhandledRejection", (reason, p) => {
    const embed = new Discord.MessageEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true}))
    .setColor("YELLOW")
    .setFooter("Anti Crash")
    .setTimestamp()
    .addField("Serval Anti Crash", "\`\`\`Unhandled Rejection/Catch\`\`\`")
    .addField("Reason", `\`\`\`${messageLimit(reason)}\`\`\``)
    //console.log(" [antiCrash] :: Unhandled Rejection/Catch");
    client.channels.cache.get("PUT_YOUR_CHANNEL_ID").send({ embeds: [embed]})
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
    .addField("Error Stack", `\`\`\`${messageLimit(err.stack)}\`\`\``)
    .addField("Error Message", `\`\`\`${messageLimit(err.message)}\`\`\``)
    client.channels.cache.get("PUT_YOUR_CHANNEL_ID").send({ embeds: [embed]})
    //console.log(" [antiCrash] :: Uncaught Exception/Catch");
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
    client.channels.cache.get("PUT_YOUR_CHANNEL_ID").send({ embeds: [embed]})
    //console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
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
    client.channels.cache.get("PUT_YOUR_CHANNEL_ID").send({ embeds: [embed]})
    console.log(" [antiCrash] :: Uncaught Reference Error");
  });


//starboard channel react filter ygy

client.on("messageCreate", async message => {
    
      const data = await starboardSchema.findOne({ guild: message.guild.id })
      if(!data) return
    
    let channelImage = "PUT_YOUR_CHANNEL_ID"
    const channelToReact = await client.channels.cache.get(channelImage)
    if(message.channel.id === channelImage) {
        if(message.attachments.size > 0) {
          await message.react('⭐')
        }
    }
    
    
})
//


//starboard system


client.on("messageReactionAdd", async(react) => {
  if(react.message.partial) await react.message.fetch()
  if(react.partial)await react.fetch()
  
  
  if(!react.message.guildId) return;
  
  var data = await starboardSchema.findOne({ guild: react.message.guildId })
  if(!data) return
  else {
    if(react._emoji.name !== '⭐') return
    var guild = await client.guilds.cache.get(react.message.guildId)
    var sendChannel = await guild.channels.fetch(data.channel)
    var channel = await guild.channels.fetch(react.message.channelId)
    var message = await channel.messages.fetch(react.message.id)
    
    if(message.author.id == client.user.id) return
    var newReaction = await message.reactions.cache.find(reaction => reaction.emoji.id === reaction._emoji.id)
    const messageEdit = await channel.messages.fetch(newReaction.message.id)
    var messageToEdit = await channel.messages.fetch(newReaction.message.id).then(e => e.content.length === 1 ? (e.content.startsWith(`⭐ ${newReaction.count} | ${channel}`) ? true : false) : false)
    const channel2 = await client.channels.cache.get(data.channel)
    const existMsg = await channel2.messages.fetch()
    const sentMessage = existMsg.find(msg => msg.embeds.length === 1 ? (msg.embeds[0].footer && msg.embeds[0].footer.text.startsWith(`#${channel.name} | ${message.id}`) ? true : false) : false)
    if(newReaction.count >= data.count) {
        var messageStarboard = message.content || "Embed/Attachment"
        let embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`${messageStarboard} \n\n[Click to jump to message!](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
        .setTimestamp()
        .setFooter(`#${channel.name} | ${message.id}`)
        //.setImage(image.url)
        if(message.attachments.size > 0) {
          let image = message.attachments.first();
          embed.setImage(image.url ? image.proxyURL : null)
        }
      
         if(sentMessage) {
             const channel2 = await client.channels.cache.get(data.channel)
             const starMsg = await sendChannel.messages.fetch(sentMessage.id);
             await starMsg.edit({ content: `⭐️ ${newReaction.count} ${channel} (${message.id})` })
            //await sendChannel.send({ content: `⭐ ${newReaction.count} | ${channel}`, embeds: [embed]})

         } 
        if(!sentMessage) {
            await sendChannel.send({ content: `⭐ ${newReaction.count} ${channel} (${message.id})`, embeds: [embed]})
            
         }
    }
  }
})



//afk
client.on("messageCreate", async (message) => {
    if(message.author.bot) return
    const id = message.author.id
    
    const afkStatus = await afkSchema.findOne({ id: id })
    if(afkStatus) {
        //await message.member.setNickname(afkStatus.username)
        await afkSchema.deleteOne({ id: id})
        message.reply("You are back! I have removed your AFK status").then(e => setTimeout(() => e.delete(), 5000))
    }
    
    const mentionedUser = message.mentions.users
    
    mentionedUser.forEach(async user => {
        if(user.bot || user.id === message.guild.id) return
        const afkStatus = await afkSchema.findOne({ id: user.id})
        
        if(afkStatus) {
            return message.reply(`${user.username} is AFK: ${afkStatus.message}`).then(e => setTimeout(() => e.delete(), 5000 ))
        }
    })
    
    
})



//starboard system

client.on("messageCreate", async (message) => {
	console.log(`Message received: ${message.content}`);

	if (message.author && message.author.bot) return;

	const tiktokRegex = /(https?:\/\/)?(www\.)?(tiktok\.com\/\S+\/?)/g; 
    const tiktokRegex2 = /(https?:\/\/)?(vt\.)?(tiktok\.com\/\S+\/?)/g; 
	const content = message.content;

	const matches = content.match(tiktokRegex, tiktokRegex2);
	if (matches) {
		const firstLink = matches[0];

		const editedContent = firstLink.replace(/tiktok\.com/g, "tnktok.com");

		try {
			//await message.delete(); 

			await message.channel.send({ content: `${editedContent}`});
			//console.log(`Replied with: ${editedContent}`);
		} catch (error) {
			//console.error(`Failed to send message or delete: ${error.message}`); 
		}
	}
});


//voice join to create

const voiceSchema = require("./models/voiceSchema")
const voiceSchemaChannel = require("./models/voice")
const voicePanel = require("./models/voicePanel")
client.on("voiceStateUpdate", async (oldState, newState) => {
    try {
        if(newState.member.guild === null) return
    } catch(e) {
        return
    }
    const joinData = await voiceSchema.findOne({ guild: newState.member.guild.id })
    const joinDataChannel = await voiceSchemaChannel.findOne({ user: newState.member.id })
    const voiceChannel = newState.channel
    
    if(!joinData) return
    if(!voiceChannel) return
    
    else {
        if(voiceChannel.id === joinData.voice) {
            try {
                const channel = await newState.member.guild.channels.create(`🎙️║ ${newState.member.user.globalName ? newState.member.user.globalName : newState.member.user.username }'s・voice`,{
                    type: "GUILD_VOICE",
                    parent: joinData.category,
                 })
                try {
                    await channel.setPosition(3)
                    await newState.member.voice.setChannel(channel.id)
                } catch(e) {
                    return
                }
                await voiceSchemaChannel.create({
                        user: newState.member.id,
                        channel: channel.id,
                        userLimit: 0,
                        lock: false,
                        invisible: false
                    })
              
            } catch(e) {
                return
            }
        } else {
            return
        }
    }
})


client.on("voiceStateUpdate", async (oldState, newState) => {
    
    if(oldState.member.guild === null) return
    
    const leaveChannel = await voiceSchemaChannel.findOne({ user: oldState.member.id })
    if(!leaveChannel) return
    const members = oldState.channel?.members
            .map((m) => m.id);
    
        const voiceChannel = await oldState.member.guild.channels.cache.get(leaveChannel.channel)
        try {
            if(members.length > 0) {
              let randomID = members[Math.floor(Math.random() * members.length)];
              let randomMember = oldState.guild.members.cache.get(randomID);
              console.log(members)
              await voiceSchemaChannel.deleteMany({ user: oldState.member.id })
              await voiceSchemaChannel.create({
                user: randomID,
                channel: oldState.channel.id,
                userLimit: 0
              })
              await voiceChannel.setName(`🎙️║ ${randomMember.user.globalName ? randomMember.user.globalName : randomMember.user.username }・voice`)
                
            } else {
              await voiceChannel.delete()
              await voiceSchemaChannel.deleteMany({ user: oldState.member.id})
                if(oldState.guild.me.voice.channel) {
                    setTimeout(async () => {
                        await oldState.guild.me.voice.disconnect()
                    }, 60*1000)
                }
            }
        } catch(e) {
            return
        }
})


// selectmenu

client.on("interactionCreate", async interaction => {
    if(!interaction.guild || !interaction.isSelectMenu()) return
    if(interaction.customId === `disconnect-${interaction.user.id}`) {
        const voiceUser = await voiceSchemaChannel.findOne({ user: interaction.user.id })
        if(!voiceUser) return interaction.reply({ content: "Could not find your data", ephemeral: true})
        const memberDisconnect = await interaction.guild.members.cache.get(interaction.values[0])
        await memberDisconnect.voice.disconnect()
        return interaction.update({
            content: `${memberDisconnect} has been kicked from your voice channels`,
            ephemeral: true,
            embeds: [],
            components: []
        })
        
    }
    else if(interaction.customId === `radio-${interaction.user.id}`) {
        const voiceUser = await voiceSchemaChannel.findOne({ user: interaction.user.id })
        if(!voiceUser) return interaction.reply({ content: "Could not find your data", ephemeral: true})
        return interaction.reply({ content: "Under development", ephemeral: true})
    }
})

//modal submit



client.on("interactionCreate", async interaction => {
   if(!interaction.guild || !interaction.isModalSubmit()) return
    if(interaction.customId === `updt-${interaction.user.id}`) {
      const LastFmUser = require("./models/lastfm")
      const newUsername = interaction.fields.getTextInputValue(`username-${interaction.user.id}`)
      await LastFmUser.findOneAndUpdate({ id: interaction.user.id, lastFmUsername: newUsername})
      await interaction.reply({ content: `**${newUsername}** Your Last.fm username has been updated!`, ephemeral: true})
  }
    else if(interaction.customId === `rename-${interaction.user.id}`) {
        
        const voiceUser = await voiceSchemaChannel.findOne({ user: interaction.user.id })
        if(!voiceUser) return interaction.reply({ content: "Could not find your data", ephemeral: true})
        const newUsername = interaction.fields.getTextInputValue(`newName-${interaction.user.id}`)
        const channel = await client.channels.cache.get(voiceUser.channel)
        await channel.setName(`🎙║ ${newUsername}'s・voice`)
        await interaction.reply({ content: `Your channel’s name is now **${newUsername}**`, ephemeral: true})
    }
    else if(interaction.customId === `userLimit-${interaction.user.id}`) {
        
        const voiceUser = await voiceSchemaChannel.findOne({ user: interaction.user.id })
        if(!voiceUser) return interaction.reply({ content: "Could not find your data", ephemeral: true})
        let newUserLimit = parseInt(interaction.fields.getTextInputValue(`newLimit-${interaction.user.id}`))
        const channel = await client.channels.cache.get(voiceUser.channel)
        if(!isNaN(newUserLimit) && newUserLimit >= 0 && newUserLimit <= 99) {
            await channel.edit({ userLimit: newUserLimit })
            voiceUser.userLimit = newUserLimit
            await voiceUser.save()
            await interaction.reply({ content: `Change the user limit to **${newUserLimit}**`, ephemeral: true})
        } else {
            await channel.edit({ userLimit: 0 })
            voiceUser.userLimit = 0
            await voiceUser.save()
            await interaction.reply({ content: `Change the user limit to **0**`, ephemeral: true})
        }
    }
})



//button

client.on("interactionCreate", async interaction => {
    
    if(!interaction.guild || !interaction.isButton()) return
    if(interaction.customId === `disable-${interaction.guild.id}`) {
        if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "**You do not have permission to do that**", ephemeral: true})
        const voiceUser = await voiceSchemaChannel.findOne({ user: interaction.user.id })
        const voiceData = await voiceSchema.findOne({ guild: interaction.guild.id })
        const panel = await voicePanel.findOne({ guild: interaction.guild.id })
        if(!voiceData) return
        await interaction.channel.messages.cache.get(panel.messageID).delete()
        await voicePanel.deleteMany({ guild: interaction.guild. id})
        await voiceSchema.deleteMany({ guild: interaction.guild.id })
        await interaction.reply({ content: "Voice creator has been deleted", ephemeral: true})
    }
    else if(interaction.customId === `visible-${interaction.guild.id}`) {
        const voiceUser = await voiceSchemaChannel.findOne({ user: interaction.user.id })
        const voiceData = await voiceSchema.findOne({ guild: interaction.guild.id })
        if(!voiceUser) return interaction.reply({ content: `You are not in a valid voice channel. Join a <#${voiceData.voice}> to create your own voice channel`, ephemeral: true})
        const userChannel = await client.channels.cache.get(voiceUser.channel)
        if(voiceUser.invisible === true) {
            return interaction.reply({ content: "❌ Your voice channel already invisible", ephemeral: true})
        }
        else if(voiceUser.invisible === false) {
            await userChannel.permissionOverwrites.edit("881363239013842945", {
                VIEW_CHANNEL: false
            })
            await userChannel.permissionOverwrites.edit(interaction.user, {
                VIEW_CHANNEL: true
            })
            await interaction.reply({ content: "✅ Made channel invisible", ephemeral: true})
            voiceUser.invisible = true
            await voiceUser.save()
        }
        
    }
    else if(interaction.customId === `invisible-${interaction.guild.id}`) {
        const voiceUser = await voiceSchemaChannel.findOne({ user: interaction.user.id })
        const voiceData = await voiceSchema.findOne({ guild: interaction.guild.id })
        if(!voiceUser) return interaction.reply({ content: `You are not in a valid voice channel. Join a <#${voiceData.voice}> to create your own voice channel`, ephemeral: true})
        const UserChannel = await client.channels.cache.get(voiceUser.channel)
        if(voiceUser.invisible === false) {
            return interaction.reply({ content: "❌ Your voice channel already visible", ephemeral: true})
        }
        else if(voiceUser.invisible === true) {
            await UserChannel.permissionOverwrites.edit("881363239013842945", {
                VIEW_CHANNEL: true
            })
            await UserChannel.permissionOverwrites.edit(interaction.user, {
                VIEW_CHANNEL: true
            })
            await interaction.reply({ content: "✅ Made channel visible", ephemeral: true})
            voiceUser.invisible = false
            await voiceUser.save()
        }
        
    }
     else if(interaction.customId === `lock-${interaction.guild.id}`) {
        const voiceUser = await voiceSchemaChannel.findOne({ user: interaction.user.id })
        const voiceData = await voiceSchema.findOne({ guild: interaction.guild.id })
        if(!voiceUser) return interaction.reply({ content: `You are not in a valid voice channel. Join a <#${voiceData.voice}> to create your own voice channel`, ephemeral: true})
         const userChannel = await client.channels.cache.get(voiceUser.channel)
         if(voiceUser.lock === true) {
             return interaction.reply({ content: "❌ Your channel already locked", ephemeral: true})
         }
         else if (voiceUser.lock === false) {
              await userChannel.permissionOverwrites.edit("881363239013842945", {
                CONNECT: false
            })
            await userChannel.permissionOverwrites.edit(interaction.user, {
                CONNECT: true
            })
            await interaction.reply({ content: "✅ Your channel has been locked", ephemeral: true})
            voiceUser.lock = true
            await voiceUser.save()
         }
     }
    else if(interaction.customId === `unlock-${interaction.guild.id}`) {
        const voiceUser = await voiceSchemaChannel.findOne({ user: interaction.user.id })
        const voiceData = await voiceSchema.findOne({ guild: interaction.guild.id })
        if(!voiceUser) return interaction.reply({ content: `You are not in a valid voice channel. Join a <#${voiceData.voice}> to create your own voice channel`, ephemeral: true})
        const userChannel = await client.channels.cache.get(voiceUser.channel)
         if(voiceUser.lock === false) {
             return interaction.reply({ content: "❌ Your channel already unlocked", ephemeral: true})
         }
         else if (voiceUser.lock === true) {
              await userChannel.permissionOverwrites.edit("881363239013842945", {
                CONNECT: true
            })
            await userChannel.permissionOverwrites.edit(interaction.user, {
                CONNECT: true
            })
            await interaction.reply({ content: "✅ Your channel has been unlocked", ephemeral: true})
            voiceUser.lock = false
            await voiceUser.save()
         }
     }
     else if(interaction.customId === `rename-${interaction.guild.id}`) {
        const voiceUser = await voiceSchemaChannel.findOne({ user: interaction.user.id })
        const voiceData = await voiceSchema.findOne({ guild: interaction.guild.id })
        if(!voiceUser) return interaction.reply({ content: `You are not in a valid voice channel. Join a <#${voiceData.voice}> to create your own voice channel`, ephemeral: true})
          const modalName = new Discord.Modal()
         .setCustomId(`rename-${voiceUser.user}`)
         .setTitle('A name for your voice channel')
         const modalInput = new Discord.TextInputComponent()
         .setCustomId(`newName-${voiceUser.user}`)
         .setStyle("SHORT")
         .setLabel("New name")
         .setRequired(false)
         const compo = new Discord.MessageActionRow().addComponents(modalInput)
         modalName.addComponents(compo)
         await interaction.showModal(modalName)
     }
    
    else if(interaction.customId === `limit-${interaction.guild.id}`) {
        const voiceUser = await voiceSchemaChannel.findOne({ user: interaction.user.id })
        const voiceData = await voiceSchema.findOne({ guild: interaction.guild.id })
        if(!voiceUser) return interaction.reply({ content: `You are not in a valid voice channel. Join a <#${voiceData.voice}> to create your own voice channel`, ephemeral: true})
         const modalLimit = new Discord.Modal()
         .setCustomId(`userLimit-${voiceUser.user}`)
         .setTitle('Change user limit')
         const modalInput = new Discord.TextInputComponent()
         .setCustomId(`newLimit-${voiceUser.user}`)
         .setStyle("SHORT")
         .setLabel("New limit of users")
         .setRequired(false)
         const compo = new Discord.MessageActionRow().addComponents(modalInput)
         modalLimit.addComponents(compo)
         await interaction.showModal(modalLimit)
     }
    else if(interaction.customId === `kick-${interaction.guild.id}`) {
        const voiceUser = await voiceSchemaChannel.findOne({ user: interaction.user.id })
        const voiceData = await voiceSchema.findOne({ guild: interaction.guild.id })
        if(!voiceUser) return interaction.reply({ content: `You are not in a valid voice channel. Join a <#${voiceData.voice}> to create your own voice channel`, ephemeral: true})
        //return interaction.reply({ content: "Under development", ephemeral: true})
        const embed = new Discord.MessageEmbed()
    .setColor("BLUE")
    .setDescription("Please select the user from the dropdown to disconnect.");
const menu = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageSelectMenu()
        .setCustomId(`disconnect-${voiceUser.user}`)
        .setPlaceholder(`Members`)
        .setMaxValues(1),
    );

const member = await client.channels.cache.get(voiceUser.channel).members.filter(e => e.user.id !== voiceUser.user).map(member => member.user)
if(member.length < 1) return interaction.reply({ content: "There's nobody on your voice channel, you're alone, like your heart", ephemeral: true})
    menu.components[0].addOptions([
        member.map(e => {
            return {
        label: `${e.globalName ? e.globalName : e.tag}`,
        value: e.id,
        emoji: "<:disconnect:1306146182732714024>"
            } })])

return interaction.reply({
    embeds: [embed],
    components: [menu],
    ephemeral: true
});
    }
    else if(interaction.customId === `channelInfo-${interaction.guild.id}`) {
        const voiceData = await voiceSchema.findOne({ guild: interaction.guild.id })
        if(!interaction.member.voice.channel) return interaction.reply({ content: `Create your own voice channel on <#${voiceData.voice}>`, ephemeral: true})
        //if(!voiceUser) return interaction.reply({ content: `You are not in a valid voice channel. Join a <#${voiceData.voice}> to create your own voice channel`, ephemeral: true})
        const channelInfo = await voiceSchemaChannel.findOne({ channel: interaction.member.voice.channel.id })
        const userData = await interaction.guild.members.cache.get(channelInfo.user)
        const members = await client.channels.cache.get(channelInfo.channel).members.map(e => e.user)
        const embed = new MessageEmbed()
        .setColor("BLUE")     .setTitle(`${userData.user.globalName ? userData.user.globalName : userData.user.username}'s channel`)
        .addField("Owner", `${userData.user.globalName ? userData.user.globalName : userData.user.username}`)
        .addField("Channel", `<#${client.channels.cache.get(channelInfo.channel).id}> ( ${client.channels.cache.get(channelInfo.channel).id} )`)
        .addField("Members in voice", `${members.map(m => m).join("\n")}`)
        .setTimestamp()
        //console.log(members)
        await interaction.reply({ embeds: [embed], ephemeral: true})
    }
    else if(interaction.customId === `radio-${interaction.guild.id}`) {
        const radioMap = {
            "Lofi": "http://lofi.stream.laut.fm/lofi?t302=2023-05-09_19-27-21&uuid=d646c9fa-d187-47d6-974c-adb3d6c36a66",
            "Radio": "https://streams.ilovemusic.de/iloveradio1.mp3",
            "Dance": "https://streams.ilovemusic.de/iloveradio2.mp3",
            "Dance 2023": "https://streams.ilovemusic.de/iloveradio36.mp3",
            "Dance First": "https://streams.ilovemusic.de/iloveradio103.mp3",
            "Dance History": "https://streams.ilovemusic.de/iloveradio26.mp3",
            "2000+ Throwbacks": "https://streams.ilovemusic.de/iloveradio37.mp3",
            "2010+ Throwbacks": "https://streams.ilovemusic.de/iloveradio38.mp3",
            "Bass by HBZ": "https://streams.ilovemusic.de/iloveradio29.mp3",
            "Chill Pop": "https://streams.ilovemusic.de/iloveradio17.mp3",
            "Greatest Hits": "https://streams.ilovemusic.de/iloveradio16.mp3",
            "Hard Style": "https://streams.ilovemusic.de/iloveradio21.mp3",
            "Hip Hop": "https://streams.ilovemusic.de/iloveradio3.mp3",
            "Hip Hop 2023": "https://streams.ilovemusic.de/iloveradio35.mp3",
            "Main Stage": "https://streams.ilovemusic.de/iloveradio22.mp3",
            "Rock": "https://streams.ilovemusic.de/iloveradio4.mp3",
            "The 90s": "https://streams.ilovemusic.de/iloveradio24.mp3",
            "Workout": "https://streams.ilovemusic.de/iloveradio23.mp3",
            "XMAS": "https://streams.ilovemusic.de/iloveradio8.mp3"
        }
        const voiceUser = await voiceSchemaChannel.findOne({ user: interaction.user.id })
        const voiceData = await voiceSchema.findOne({ guild: interaction.guild.id })
        if(!voiceUser) return interaction.reply({ content: `You are not in a valid voice channel. Join a <#${voiceData.voice}> to create your own voice channel`, ephemeral: true})
        //return interaction.reply({ content: "Under development", ephemeral: true})
        const embed = new Discord.MessageEmbed()
    .setColor("BLUE")
    .setDescription("Select which station you want to connect to");
        const menu = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageSelectMenu()
        .setCustomId(`radio-${voiceUser.user}`)
        .setPlaceholder(`Station`)
        .setMaxValues(1),
    )
    menu.components[0].addOptions([
            Object.entries(radioMap).map(([key, value]) => {
        return {
            label: key,
            value: value,
            emoji: "<:radio1:1307652036132732959>"
        }
        })
      ])

return interaction.reply({
    embeds: [embed],
    components: [menu],
    ephemeral: true
});
    }
})




client.login("DISCORD_TOKEN");

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
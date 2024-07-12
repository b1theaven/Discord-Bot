const Discord = require("discord.js");
const fs = require("fs");
const path = require('path')
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
const dbl = new DBL("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg2NDAyNjA0MzM3ODU2NTE2MCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjI3MzA4NTY3fQ.searxcymYsI0v0gfNt91oXLSHqWIOzNMx4shyxmiRgM", client);
client.dbl = dbl;
const { readdirSync } = require("fs");
const express = require("express");
const app = express();
const prefixSchema = require('./models/prefix');
const { loadLanguages } = require("./language");
const { GoogleGenerativeAI } = require('@google/generative-ai')
const NAME = "rizky"
const langSchema = require("./models/language");
const lang = require("./language");
const { Client, Intents, MessageActionRow, Collection, MessageButton, MessageEmbed, Events, Permissions } = require("discord.js");
const TICKET_CATEGORY_ID = '928313787998666792'; // Ganti dengan ID kategori untuk tiket
const TICKET_LOG_CHANNEL_ID = '1257199978628120586'; // Ganti dengan ID channel log tiket

const axios = require("axios")
const urls = ["https://cheddar-deluxe-brook.glitch.me"]
setInterval(function() {
            urls.forEach(url => {
            axios.get(url).then(console.log("Pong at " + Date.now())).catch(() => {});
        })
    }, 60 * 1000);
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
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
    remindMe.loadReminders(client);
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

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // Jika pesan adalah perintah nuke
    if (message.content.startsWith('a.nuke')) {
        // Periksa jika pengguna adalah admin
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return message.reply('Anda tidak memiliki izin untuk menjalankan perintah ini.');
        }

        const channel = message.channel;

        // Dapatkan semua izin channel
        const channelPermissions = channel.permissionOverwrites.cache.map(perm => ({
            id: perm.id,
            allow: perm.allow.toArray(),
            deny: perm.deny.toArray()
        }));

        // Buat embed konfirmasi
        const embed = new MessageEmbed()
            .setTitle('Nuke Channel')
            .setDescription('Channel ini akan di-nuke dalam 5 detik.')
            .setColor('RED');

        await message.channel.send({ embeds: [embed] });

        // Tunggu 5 detik sebelum melakukan nuke
        setTimeout(async () => {
            const newChannel = await channel.clone(); // Clone channel
            await channel.delete(); // Hapus channel lama

            // Pindahkan izin ke channel baru
            for (const perm of channelPermissions) {
                await newChannel.permissionOverwrites.create(perm.id, {
                    allow: perm.allow,
                    deny: perm.deny
                });
            }

            // Kirim pesan konfirmasi di channel baru
            const nukeEmbed = new MessageEmbed()
                .setTitle('Channel Nuked')
                .setDescription(`Channel ini telah di-nuke oleh ${message.author.tag}`)
                .setColor('GREEN');

            newChannel.send({ embeds: [nukeEmbed] });
        }, 5000);
    };
});

// Simpan daftar user yang memiliki tiket aktif
const activeTickets = new Map();

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // Mengirim pesan dengan tombol buat tiket saat perintah 'a.ticket' dikirim
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
        if (!['671351376642834440', '1005082777206661190', '627027667685867530', '465491570305662978'].includes(interaction.member.id)) {
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
  const logChannel = client.channels.cache.get('1257199978628120586');
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
  const logChannel = client.channels.cache.get('1257199978628120586');
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
  const logChannel = client.channels.cache.get('1257199978628120586');
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
const { EmbedBuilder, MessageEmbed } = require("discord.js");
const ms = require("ms");
const discord = require("discord.js");
const schema = require("../models/commands");
const { stripIndents } = require("common-tags");
const humanizeDuration = require("humanize-duration");
const prefixSchema = require("../models/prefix");
const Discord = require("discord.js");
const lang = require("../language");
exports.run = async (client, message) => {
  const msg = message;
  let prefix;
  let dataPrefix = await prefixSchema.findOne({
    guild: message.guild.id,
  });
  if (dataPrefix === null) {
    prefix = "a.";
  } else {
    prefix = dataPrefix.prefix;
  }

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let commandfile;

  if (message.content.toLowerCase().includes("riztapayment")) {
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("💰 Metode Pembayaran")
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(
        "Berikut adalah metode pembayaran yang tersedia:\n\n" +
          "💳 **Bank Transfer** (Mandiri, Jago)\n" +
          "📱 **E-Wallet** (GoPay, OVO, DANA) : 0895615493985\n" +
          "\n" +
          "Silakan hubungi admin untuk informasi lebih lanjut. Dan jangan lupa selalu cek list yang ada di <#928314947480469524> ya!\n" +
          "Note: Harga pada list bisa berubah sewaktu-waktu tanpa adanya update list dari owner"
      )
      .setFooter("Rizta Store Payment System");

    return message.channel.send({ embeds: [embed] });
  }

  if (cmd.startsWith(prefix)) {
    commandfile =
      client.commands.get(cmd.slice(prefix.length)) ||
      client.aliases.get(cmd.slice(prefix.length));
  } else if (cmd.toLowerCase() === "serval") {
    let secondWord = messageArray[1];
    if (!secondWord) return;
    commandfile =
      client.commands.get(secondWord) || client.aliases.get(secondWord);
    args = messageArray.slice(2);
  }

  if (!commandfile) return;
  if (commandfile.ownerOnly) {
    if (
      ![
        "671351376642834440",
        "1005082777206661190",
        "627027667685867530",
      ].includes(msg.author.id)
    ) {
      return;
    }
  }
  if (commandfile.permission) {
    const authorPerms = msg.channel.permissionsFor(msg.member);
    if (!authorPerms || !authorPerms.has(commandfile.permission)) {
      const permEmbed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setDescription(
          lang(msg.guild, "MISSING_PERMISSION") +
            "\n\n" +
            lang(msg.guild, "INTERACTION_PERMISSION") +
            " `" +
            commandfile.permission +
            "`"
        );
      return msg.reply({ embeds: [permEmbed] });
    }
  }
  if (commandfile.botPermission) {
    const botPerms = msg.channel.permissionsFor(client.user);
    if (!botPerms || !botPerms.has(commandfile.botPermission)) {
      const botPermEmbed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setDescription(
          lang(msg.guild, "MISSING_PERMISSION") +
            "\n\n" +
            lang(msg.guild, "BOT_PERMISSION") +
            " `" +
            commandfile.botPermission +
            "`"
        );
      return msg.reply({ embeds: [botPermEmbed] });
    }
  }
  const check = await schema.findOne({ Cmds: commandfile.name });
  if (check) {
    if (check.Cmds.includes(commandfile.name))
      return message.channel.send({
        content: lang(msg.guild, "COMMAND_DISABLE"),
      });

    try {
      const cmd = await commandfile.run(client, message, args);
    } catch (err) {
      const ch = "1260909159432327299";
      const errEmbed2 = new MessageEmbed()
        .setTitle("Command butuh perbaikan segera")
        .setDescription(
          "Sistem mendeteksi adanya error pada command " +
            "`" +
            commandfile.name +
            "`"
        )
        .addField("Error Stack", `\`${messageLimit(err.stack)}\``, true)
        .addField("Error Message", `\`${messageLimit(err.message)}\``, true)
        .setFooter("Error Logging");
      msg.channel.send({
        content: "Maaf, terjadi kesalahan saat menjalankan perintah",
      });
      client.channels.cache.get(ch).send({ embeds: [errEmbed2] });
    }
  }
  if (client.cooldown.has(`${message.author.id}-${commandfile.name}`)) {
    return message.channel.send({
      content: stripIndents`
          **${lang(msg.guild, "COMMAND_COOLDOWN")}**: \`${humanizeDuration(
        client.cooldown.get(`${msg.author.id}-${commandfile.name}`) - Date.now()
      )}\``,
    });
  }
  try {
    const cmd = await commandfile.run(client, message, args);
  } catch (err) {
    const ch = "1260909159432327299";
    const errEmbed = new MessageEmbed()
      .setTitle("Command butuh perbaikan segera")
      .setDescription(
        "Sistem mendeteksi adanya error pada command " +
          "`" +
          commandfile.name +
          "`"
      )
      .addField("Error Stack", `\`${messageLimit(err.stack)}\``, true)
      .addField("Error Message", `\`${messageLimit(err.message)}\``, true)
      .setFooter("Error Logging");
    msg.channel.send({
      content: "Maaf, terjadi kesalahan saat menjalankan perintah",
    });
    client.channels.cache.get(ch).send({ embeds: [errEmbed] });
  }

  if (commandfile.cooldown) {
    const timeOut = commandfile.cooldown * 1000;
    client.cooldown.set(
      `${message.author.id}-${commandfile.name}`,
      Date.now() + timeOut
    );
    setTimeout(() => {
      client.cooldown.delete(`${message.author.id}-${commandfile.name}`);
    }, timeOut);
  }
};

function messageLimit(str) {
  if (str.length > 1000) {
    return str.substring(0, 1001) + "...";
  } else {
    return str;
  }
}

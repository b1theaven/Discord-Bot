const { MessageEmbed } = require("discord.js");
const autoMessageSchema = require("../../models/autoMessage");

module.exports = {
  name: "auto-message",
  description: "Manage automatic messages",
  permission: "MANAGE_GUILD",
  options: [
    {
      name: "add",
      description: "Add a new auto message",
      type: "SUB_COMMAND",
      options: [
        {
          name: "trigger",
          description: "Trigger word or phrase",
          type: "STRING",
          required: true,
        },
        {
          name: "response",
          description: "Response message",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Remove an existing auto message",
      type: "SUB_COMMAND",
      options: [
        {
          name: "id",
          description: "ID of the auto message to remove",
          type: "INTEGER",
          required: true,
        },
      ],
    },
    {
      name: "edit",
      description: "Edit an existing auto message",
      type: "SUB_COMMAND",
      options: [
        {
          name: "id",
          description: "ID of the auto message to edit",
          type: "INTEGER",
          required: true,
        },
        {
          name: "new_trigger",
          description: "New trigger word or phrase",
          type: "STRING",
          required: false,
        },
        {
          name: "new_response",
          description: "New response message",
          type: "STRING",
          required: false,
        },
      ],
    },
    {
      name: "list",
      description: "Show all auto messages",
      type: "SUB_COMMAND",
    },
  ],

  execute: async (client, interaction, args) => {
    if (!interaction.member.permissions.has("MANAGE_GUILD")) {
      return interaction.reply({
        content: "❌ You do not have permission to use this command!",
        ephemeral: true,
      });
    }

    const subCommand = interaction.options.getSubcommand();

    // Tambah Auto Message
    if (subCommand === "add") {
      const trigger = interaction.options.getString("trigger").toLowerCase();
      const response = interaction.options.getString("response");

      // Cari ID terakhir dan tambahkan 1
      const lastMessage = await autoMessageSchema
        .findOne({ guildId: interaction.guild.id })
        .sort({ id: -1 });
      const newId = lastMessage ? lastMessage.id + 1 : 1;

      // Cek apakah trigger sudah ada
      const existing = await autoMessageSchema.findOne({
        guildId: interaction.guild.id,
        trigger,
      });
      if (existing) {
        return interaction.reply({
          content: `❌ This trigger already exists!`,
          ephemeral: true,
        });
      }

      // Simpan ke database dengan ID baru
      await autoMessageSchema.create({
        guildId: interaction.guild.id,
        id: newId,
        trigger,
        response,
      });

      const embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("✅ Auto Message Added")
        .setDescription(
          `**ID:** \`${newId}\`\n**Trigger:** \`${trigger}\`\n**Response:** ${response}`
        );

      return interaction.reply({ embeds: [embed] });
    }

    // Hapus Auto Message
    if (subCommand === "remove") {
      const id = interaction.options.getInteger("id");

      // Hapus berdasarkan ID angka
      const deleted = await autoMessageSchema.findOneAndDelete({
        guildId: interaction.guild.id,
        id,
      });

      if (!deleted) {
        return interaction.reply({
          content: "❌ Auto message not found!",
          ephemeral: true,
        });
      }

      const embed = new MessageEmbed()
        .setColor("RED")
        .setTitle("🗑️ Auto Message Removed")
        .setDescription(
          `**ID:** \`${id}\`\n**Trigger:** \`${deleted.trigger}\``
        );

      return interaction.reply({ embeds: [embed] });
    }

    // Edit Auto Message
    if (subCommand === "edit") {
      const id = interaction.options.getInteger("id");
      const newTrigger = interaction.options.getString("new_trigger");
      const newResponse = interaction.options.getString("new_response");

      const autoMessage = await autoMessageSchema.findOne({
        guildId: interaction.guild.id,
        id,
      });
      if (!autoMessage) {
        return interaction.reply({
          content: "❌ Auto message not found!",
          ephemeral: true,
        });
      }

      if (!newTrigger && !newResponse) {
        return interaction.reply({
          content:
            "❌ You must provide at least a new trigger or a new response!",
          ephemeral: true,
        });
      }

      if (newTrigger) autoMessage.trigger = newTrigger.toLowerCase();
      if (newResponse) autoMessage.response = newResponse;
      await autoMessage.save();

      const embed = new MessageEmbed()
        .setColor("YELLOW")
        .setTitle("✏️ Auto Message Updated")
        .setDescription(
          `**ID:** \`${autoMessage.id}\`\n**New Trigger:** \`${autoMessage.trigger}\`\n**New Response:** ${autoMessage.response}`
        );

      return interaction.reply({ embeds: [embed] });
    }

    // List Auto Message
    if (subCommand === "list") {
      const messages = await autoMessageSchema.find({
        guildId: interaction.guild.id,
      });

      if (messages.length === 0) {
        return interaction.reply({
          content: "❌ No auto messages found!",
          ephemeral: true,
        });
      }

      const embed = new MessageEmbed()
        .setColor("BLUE")
        .setTitle("📜 Auto Message List")
        .setDescription(
          messages
            .map(
              (m) =>
                `**ID:** \`${m.id}\`\n**Trigger:** \`${m.trigger}\`\n**Response:** ${m.response}`
            )
            .join("\n\n")
        );

      return interaction.reply({ embeds: [embed] });
    }
  },
};

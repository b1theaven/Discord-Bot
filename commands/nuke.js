const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');

module.exports = {
  name: 'nuke',
  permission: ["ADMINISTRATOR"],
  description: 'Nuke the channel. (Admin only)',
  run: async (client, message, args) => {
    // Check if the user has admin permissions
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return message.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const confirmButton = new MessageButton()
      .setCustomId('nuke_confirm')
      .setLabel('Yes')
      .setStyle('DANGER');

    const cancelButton = new MessageButton()
      .setCustomId('nuke_cancel')
      .setLabel('No')
      .setStyle('SECONDARY');

    const row = new MessageActionRow()
      .addComponents(confirmButton, cancelButton);

    const embed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Nuke Channel')
      .setDescription('Are you sure you want to nuke this channel? This action cannot be undone.');

    // Mengirim embed tanpa pesan tambahan di atasnya
    const messageSent = await message.reply({ embeds: [embed], components: [row] });

    const filter = i => i.user.id === message.author.id;
    const collector = messageSent.createMessageComponentCollector({
      componentType: "BUTTON",
      filter,
      time: 60 * 1000,
    });

    collector.on("collect", async i => {
      if (i.user.id !== message.author.id) {
        return i.reply({ content: 'Only the admin who initiated the command can interact with these buttons.', ephemeral: true });
      }

      i.deferUpdate();

      const channel = message.channel;

      // Dapatkan semua izin channel
      const channelPermissions = channel.permissionOverwrites.cache.map(perm => ({
        id: perm.id,
        allow: perm.allow.toArray(),
        deny: perm.deny.toArray()
      }));

      if (i.customId === 'nuke_confirm') {
        const embed = new MessageEmbed()
          .setTitle('Nuke Channel')
          .setDescription('Channel ini akan di-nuke dalam 5 detik.')
          .setColor('RED');

        await messageSent.edit({ embeds: [embed], components: [] });

        setTimeout(async () => {
          const newChannel = await channel.clone();
          await channel.delete();

          for (const perm of channelPermissions) {
            await newChannel.permissionOverwrites.create(perm.id, {
              allow: perm.allow,
              deny: perm.deny
            });
          }

          const nukeEmbed = new MessageEmbed()
            .setTitle('Channel Nuked')
            .setDescription(`Channel ini telah di-nuke oleh <@${i.user.id}>`)
            .setColor('GREEN');

          newChannel.send({ embeds: [nukeEmbed] });
        }, 5000);
      } else if (i.customId === 'nuke_cancel') {
        await messageSent.edit({ content: 'Nuke action cancelled.', components: [] });

        // Hapus embed setelah 3 detik
        setTimeout(async () => {
          await messageSent.delete();
        }, 3000);
      }
    });

    collector.on("end", collected => {
      if (collected.size === 0) {
        messageSent.edit({ content: 'Nuke action timed out and was cancelled.', components: [] });
      }
    });
  }
};
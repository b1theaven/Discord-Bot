const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'boosters.json');
let data = require(dataPath);

module.exports = {
    name: 'rolegive',
    description: 'Give the custom role to another user with verification',
    run: async (client, message, args) => {
        if (!message.member.premiumSince) {
            return message.reply('Anda tidak memiliki boost untuk memberikan role custom.');
        }

        if (args.length < 1) {
            return message.reply('Format perintah salah. Gunakan `!roleGive @user`.');
        }

        const targetUser = message.mentions.members.first();
        if (!targetUser) {
            return message.reply('Pengguna tidak ditemukan. Pastikan Anda mention pengguna yang ingin diberikan role.');
        }

        const boosterData = data.boosters[message.member.id];
        if (!boosterData || !boosterData.hasCustomRole) {
            return message.reply('Anda tidak memiliki role custom untuk diberikan.');
        }

        if (boosterData.givenTo) {
            return message.reply('Anda sudah memberikan role custom kepada pengguna lain.');
        }

        const role = message.guild.roles.cache.get(boosterData.roleInfo.roleId);
        if (!role) {
            return message.reply('Role tidak ditemukan.');
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('accept')
                    .setLabel('Accept')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('decline')
                    .setLabel('Decline')
                    .setStyle('DANGER')
            );

        const filter = i => i.user.id === targetUser.id;

        const messageToSend = await message.channel.send({
            content: `${targetUser}, Anda telah ditawarkan role ${role.name} oleh ${message.member}. Apakah Anda menerima?`,
            components: [row]
        });

        const collector = messageToSend.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'accept') {
                await targetUser.roles.add(role);
                boosterData.givenTo = targetUser.id;
                fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
                await i.update({ content: `Role ${role.name} berhasil diberikan kepada ${targetUser}.`, components: [] });
            } else {
                await i.update({ content: 'Permintaan role ditolak.', components: [] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                messageToSend.edit({ content: 'Tidak ada respon dalam waktu 1 menit, permintaan role dibatalkan.', components: [] });
            }
        });
    }
};

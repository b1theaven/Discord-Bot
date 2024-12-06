const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'boosters.json');
let data = require(dataPath);
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
    name: 'role',
    description: 'Create a custom role for server boosters',
    run: async (client, message, args) => {
        let embedMessage = new MessageEmbed()
            .setColor("RED")
            .addField("a.role create <nama role> <warna>", "Untuk membuat custom roles", true)
            .addField("a.role edit <nama role> [warna]", "Untuk mengedit custom roles", true)
            .addField("a.role give <@user>", "Untuk memberikan custom roles kepada orang yang kamu tag", true)
            .setDescription("```<> Required | [] Optional```")
            .setTitle("Benefit Boosters")
            .setThumbnail(message.guild.iconURL({ dynamic: true }));
      
        if (!message.member.premiumSince) {
             return message.reply('Anda tidak memiliki boost untuk membuat role custom.');
        }

        if (!message.guild.me.permissions.has('MANAGE_ROLES')) {
            return message.reply('Bot tidak memiliki izin untuk mengelola role.');
        }

        if (args.length < 2) {
            return message.channel.send({ embeds: [embedMessage]});
        }

        if (args[0].toLowerCase() === "create") {
            const roleName = args.slice(1, -1).join(' ');
            const roleColor = args[args.length - 1];

            const boosterData = data.boosters[message.member.id];
            if (boosterData && boosterData.hasCustomRole) {
                return message.reply('Anda sudah memiliki role custom.');
            }

            try {
                const role = await message.guild.roles.create({
                    name: roleName,
                    color: roleColor,
                    reason: 'Custom role for server booster',
                });

                const boosterRoleId = '912980818371178518';
                const boosterRole = message.guild.roles.cache.get(boosterRoleId);
                if (boosterRole) {
                    await role.setPosition(boosterRole.position + 1);
                }

                if (!data.boosters[message.member.id]) {
                    data.boosters[message.member.id] = {};
                }

                data.boosters[message.member.id].hasCustomRole = true;
                data.boosters[message.member.id].roleInfo = {
                    roleId: role.id,
                    roleName: roleName,
                    roleColor: roleColor
                };
                fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

                await message.member.roles.add(role);
                message.reply(`Role custom ${roleName} berhasil dibuat dengan warna ${roleColor}.`);
            } catch (error) {
                console.error(error);
                message.reply('Terjadi kesalahan saat membuat role custom.');
            }
        } else if (args[0].toLowerCase() === "edit") {
    const roleColor = args[args.length - 1].startsWith('#') ? args[args.length - 1] : null;
    const newRoleName = roleColor ? args.slice(1, -1).join(' ') : args.slice(1).join(' ');

    const boosterData = data.boosters[message.member.id];

    if (!boosterData || !boosterData.hasCustomRole) {
        return message.reply('Anda tidak memiliki role custom untuk diedit.');
    }

    const role = message.guild.roles.cache.get(boosterData.roleInfo.roleId);
    if (!role) {
        return message.reply('Role tidak ditemukan.');
    }

    try {
        await role.setName(newRoleName);
        if (roleColor) {
            await role.setColor(roleColor);
            boosterData.roleInfo.roleColor = roleColor;
        }
        boosterData.roleInfo.roleName = newRoleName;
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        message.reply(`Role berhasil diubah menjadi ${newRoleName} dengan warna ${roleColor ? roleColor : boosterData.roleInfo.roleColor}.`);
    } catch (error) {
        console.error(error);
        let embedError = new MessageEmbed()
            .setColor("RED")
            .addField("Terjadi kesalahan", "```Kesalahan ini bisa terjadi karena Anda tidak memasukkan kode warna hex yang valid.```")
            .addField("Error stack", `\`\`\`${error.stack}\`\`\``)
            .addField("Error message", `\`\`\`${error.message}\`\`\``);
        return message.reply({ embeds: [embedError] });
    }
} else if (args[0].toLowerCase() === "give") {
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
    }
};
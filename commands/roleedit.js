const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'boosters.json');
let data = require(dataPath);

module.exports = {
    name: 'roleedit',
    description: 'Edit the custom role for server boosters',
    run: async (client, message, args) => {
        if (!message.member.premiumSince) {
            return message.reply('Anda tidak memiliki boost untuk mengedit role custom.');
        }

        if (args.length < 2) {
            return message.reply('Format perintah salah. Gunakan `a.roleedit <nama baru> <warna>`.');
        }

        const newRoleName = args.slice(0, -1).join(' ');
        const roleColor = args[args.length - 1];

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
            await role.setColor(roleColor);
            boosterData.roleInfo.roleName = newRoleName;
            boosterData.roleInfo.roleColor = roleColor;
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
            message.reply(`Role berhasil diubah menjadi ${newRoleName} dengan warna ${roleColor}.`);
        } catch (error) {
            console.error(error);
            message.reply('Terjadi kesalahan saat mengedit role custom.');
        }
    }
};
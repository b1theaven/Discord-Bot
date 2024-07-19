const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'boosters.json');
let data = require(dataPath);

module.exports = {
    name: 'rolecreate',
    description: 'Create a custom role for server boosters',
    run: async (client, message, args) => {
        if (!message.member.premiumSince) {
            return message.reply('Anda tidak memiliki boost untuk membuat role custom.');
        }

        if (!message.guild.me.permissions.has('MANAGE_ROLES')) {
            return message.reply('Bot tidak memiliki izin untuk mengelola role.');
        }

        if (args.length < 2) {
            return message.reply('Format perintah salah. Gunakan `a.rolecreate <nama> <warna>`.');
        }

        const roleName = args.slice(0, -1).join(' ');
        const roleColor = args[args.length - 1];

        const boosterData = data.boosters[message.member.id];
        if (boosterData && boosterData.hasCustomRole) {
            return message.reply('Anda sudah memiliki role custom.');
        }

        try {
            // Create the role
            const role = await message.guild.roles.create({
                name: roleName,
                color: roleColor,
                reason: 'Custom role for server booster',
            });

            // Replace 'YOUR_BOOSTER_ROLE_ID' with the actual ID of the booster role
            const boosterRoleId = '1263690055436861512';
            const boosterRole = message.guild.roles.cache.get(boosterRoleId);
            if (boosterRole) {
                // Set the position of the custom role above the server booster role
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
    }
};
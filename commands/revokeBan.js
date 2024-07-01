const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'revokeBan',
    aliases: ['unban'],
    description: 'Revokes a ban for a user.',
    usage: '<user_id>',
    cooldown: 5,
    run: async (client, msg, args) => {
        if (!msg.member.permissions.has('BAN_MEMBERS')) {
            return msg.reply({ content: 'You do not have permission to use this command.' });
        }

        const userId = args[0];
        if (!userId) {
            return msg.reply({ content: 'Please provide a valid user ID to revoke the ban.' });
        }

        try {
            const bannedUser = await msg.guild.bans.fetch(userId);
            if (!bannedUser) {
                return msg.reply({ content: 'This user is not banned.' });
            }

            await msg.guild.bans.remove(userId);

            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('Ban Revoked')
                .setDescription(`The ban for user <@${userId}> has been revoked by ${msg.author.tag}.`)
                .setTimestamp();

            msg.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error('Error revoking ban:', error);
            msg.reply({ content: 'An error occurred while trying to revoke the ban. Please ensure the user ID is correct and try again.' });
        }
    }
};

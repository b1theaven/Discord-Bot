const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const fs = require('fs');
const path = require('path');

const giveawaysFile = path.resolve(__dirname, '../giveaways.json');

let giveaways = [];
if (fs.existsSync(giveawaysFile)) {
    try {
        giveaways = JSON.parse(fs.readFileSync(giveawaysFile, 'utf8'));
        if (!Array.isArray(giveaways)) giveaways = [];
    } catch (error) {
        console.error('Error parsing giveaways.json:', error);
        giveaways = [];
    }
}

function saveGiveaways() {
    fs.writeFileSync(giveawaysFile, JSON.stringify(giveaways, null, 2));
}

async function startGiveaway(client, message, duration, winnersCount, prize) {
    const endTime = Date.now() + ms(duration);
    const embed = new MessageEmbed()
        .setTitle('🎉 **GIVEAWAY** 🎉')
        .setDescription(`Prize: **${prize}**\nHosted by: ${message.author}\nReact with 🎉 to enter!`)
        .setFooter(`Ends at`)
        .setTimestamp(endTime)
        .setColor('RANDOM');

    const giveawayMessage = await message.channel.send({ embeds: [embed] });
    await giveawayMessage.react('🎉');

    const giveaway = {
        channelId: message.channel.id,
        messageId: giveawayMessage.id,
        endTime,
        winnersCount,
        prize,
        host: message.author.id,
    };

    giveaways.push(giveaway);
    saveGiveaways();

    scheduleGiveawayEnd(client, giveaway);
}

function scheduleGiveawayEnd(client, giveaway) {
    const timeRemaining = giveaway.endTime - Date.now();
    if (timeRemaining <= 0) {
        endGiveaway(client, giveaway);
    } else {
        setTimeout(() => endGiveaway(client, giveaway), timeRemaining);
    }
}

async function endGiveaway(client, giveaway) {
    const channel = await client.channels.fetch(giveaway.channelId);
    if (!channel) return;

    const giveawayMessage = await channel.messages.fetch(giveaway.messageId);
    if (!giveawayMessage) return;

    const reactions = giveawayMessage.reactions.cache.get('🎉');
    if (!reactions) return;

    const users = await reactions.users.fetch();
    const filteredUsers = users.filter(user => !user.bot);

    if (filteredUsers.size === 0) {
        channel.send('No one entered the giveaway.');
        return;
    }

    const winners = filteredUsers.random(giveaway.winnersCount);

    channel.send(`🎉 Congratulations ${winners.map(u => `<@${u.id}>`).join(', ')}! You won **${giveaway.prize}**!`);

    const logChannel = client.channels.cache.get('1258628318065070167'); // Ganti dengan ID channel log Anda
    if (logChannel) {
        const logEmbed = new MessageEmbed()
            .setTitle('Giveaway Ended')
            .setDescription(`Prize: **${giveaway.prize}**\nWinners: ${winners.map(u => `<@${u.id}>`).join(', ')}\nHosted by: <@${giveaway.host}>`)
            .setTimestamp()
            .setColor('RANDOM');
        logChannel.send({ embeds: [logEmbed] });
    }

    giveaways = giveaways.filter(g => g.messageId !== giveaway.messageId);
    saveGiveaways();
}

module.exports = {
    name: 'giveaway',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You do not have the required permissions to use this command.');
        }

        const duration = args[0];
        const winnersCount = parseInt(args[1]);
        const prize = args.slice(2).join(' ');

        if (!duration || isNaN(winnersCount) || !prize) {
            return message.channel.send('Format: a.giveaway <duration> <number_of_winners> <prize>');
        }

        startGiveaway(client, message, duration, winnersCount, prize);
    }
};

// Schedule all existing giveaways on bot start
module.exports.scheduleGiveaways = (client) => {
    giveaways.forEach(giveaway => scheduleGiveawayEnd(client, giveaway));
};

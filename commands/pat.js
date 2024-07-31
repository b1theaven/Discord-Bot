const { CommandInteraction, MessageEmbed } = require('discord.js');
const Nekos = require('nekos.life');
const { sfw } = new Nekos();

module.exports = {
  name: 'pat',
  description: 'Pat someone!',
  run: async (client, message, args,) => {
    await client.neko.pat().then(async k => {
    const user = message.mentions.members.first() || message.member
    const embed = new MessageEmbed()
      .setColor('#ff69b4')
      .setTitle(`${message.member.user.username} pat ${user.user.username}!`)
      .setImage(k.url)
      .setFooter('Powered by nekos.life');

    await message.reply({ embeds: [embed] });
    })
  }
}

const { MessageEmbed } = require('discord.js');
const axios = require('axios')

module.exports = {
  name: "lyrics",
  description: "Get lyrics for song",
  options: [
    {

      name: "title",
      description: "Provide something to search",
      type: "STRING",
      required: true

 }

],
  execute: async(client, interaction, args) => {
    const title = interaction.options.getString('title');

    const embed = new MessageEmbed();
    await interaction.deferReply();

    await axios.get(`https://some-random-api.com/others/lyrics?title=${title}`).then(async (data) => {
      console.log(data)
      embed
        .setColor('BLUE')
        .setTitle(`${data.data.title}`)
        
        .setThumbnail(data.data.thumbnail.genius)
        .setFooter({text:`Song by ${data.data.author}`})
        .setDescription(`${data.data.lyrics.slice(0, 4096)}`);
      
      await interaction.editReply({ embeds: [embed] });
    }).catch(() => {
      embed
        .setColor('RED')
        .setDescription(`Couldn't find any song with that title`);
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    });
  },
};
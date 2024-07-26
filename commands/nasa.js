const KEY = ''
const { MessageEmbed } = require("discord.js")
const fetch = require("node-fetch")
module.exports = {
  name: "nasa",
  cooldown: 5,
  run: async (client, message, args) => {
const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${KEY}`)
const data = await response.json();
    console.log(data)

            if (data.error) {
                throw new Error(data.error.message);
            }

            const nasaEmbed = new MessageEmbed()
                .setColor('BLUE')
                .setTitle('NASA Astronomy Picture of the Day')
                .setImage(data.url)
                .setDescription(data.explanation)
                .setTimestamp()
                .setFooter("NASA Picture of the Day")

            message.channel.send({ embeds: [nasaEmbed] });
      }
}
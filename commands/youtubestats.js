const fetch = require("node-superfetch");
const Discord = require("discord.js");
const google2 = ""
   let google = ""
module.exports = {
  name: "Youtube Stats", 
  description: "Showing information channel user",
  aliases: ["ytstats"],
  run: async (client, message, args) => {
    let name = args.join(" ");
    if (!name) return message.channel.send("Contoh: a.youtubestats MrBeast");

    const channel = await fetch.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${name}&key=${google}&maxResults=1&type=channel`).then(async e => {
        console.log(e.body.items[0].id.channelId)

    if (!e.body.items[0]) return message.channel.send({ content: "Tidak dapat menemukan nama channel yang di maksud"});

    const data = await fetch.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics,brandingSettings&id=${e.body.items[0].id.channelId}&key=${google}`)
    .catch(() => message.channel.send("Unknown channel"));

    const embed = new Discord.MessageEmbed()
    .setColor("BLUE")
    .setThumbnail(e.body.items[0].snippet.thumbnails.high.url)
    .setTimestamp()
    .setFooter(`Request ${message.author.tag}`)
    .addField("Channel Name", e.body.items[0].snippet.channelTitle, true)
    .addField("Channel Description", e.body.items[0].snippet.description, true)
    .addField("Subscriber Count", parseInt(data.body.items[0].statistics.subscriberCount).toLocaleString(), true)
    .addField("Total Views", parseInt(data.body.items[0].statistics.viewCount).toLocaleString(), true)
    .addField("Total Videos", parseInt(data.body.items[0].statistics.videoCount).toLocaleString(), true)
    .addField("Account Created", new Date(e.body.items[0].snippet.publishedAt).toDateString(), true)
    .addField("Channel Link", `[${e.body.items[0].snippet.channelTitle}](https://www.youtube.com/channel/${e.body.items[0].id.channelId})`, true)
    return message.channel.send({embeds: [embed]});
  })
    }
}
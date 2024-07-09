const Discord = require("discord.js")
const {stripIndents} = require("common-tags")
module.exports = {
  name: "worldclock",
  aliases: ["ytdl"],
  run: async (client, message, args) => {
    
          var gmt = new Date().toLocaleString("en-US", { timeZone: "Europe/London" })
          var est = new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
          var pst = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
          var cst = new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" })
          var mst = new Date().toLocaleString("en-US", { timeZone: "America/Phoenix" })
          var aest = new Date().toLocaleString("en-US", { timeZone: "Australia/Sydney" })
          var awst = new Date().toLocaleString("en-US", { timeZone: "Australia/Perth" })
          var kst = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
          var ist = new Date().toLocaleString("en-US", { timeZone: "Asia/Calcutta" })
          var wib = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
          var wita = new Date().toLocaleString("en-US", { timeZone: "Asia/Makassar" })
          var wit = new Date().toLocaleString("en-US", { timeZone: "Asia/Jayapura" })
          

          const worldClock = new Discord.MessageEmbed()
            .setAuthor('World Clock - Timezones')
          .setDescription(stripIndents`
          :flag_id: Indonesia (WIB) \`${wib}\`
          :flag_id: Indonesia (WITA) \`${wita}\`
          :flag_id: Indonesia (WIT) \`${wit}\`
          :flag_eu: London (GMT) \`${gmt}\`
          :flag_us: New York (EST) \`${est}\`
          :flag_us: Los Angles (PST) \`${pst}\`
          :flag_us: Mexico City (CST) \`${cst}\`
          :flag_au: Sydney (AEST) \`${aest}\`
          :flag_au: Perth (AWST) \`${awst}\`
          :flag_kr: Korean (KST) \`${kst}\`
          :flag_in: India (IST) \`${ist}\``)
            .setColor('BLUE')

          message.channel.send({ embeds: [worldClock] })
  }
}
const { MessageEmbed, MessageAttachment } = require("discord.js")
const apiUrl = "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json"
const axios = require("axios")

module.exports = {
  name: "bmkg",
  description: "Indonesian earthquake data from BMKG",
  options: [ 
    {
      name: "type",
      description: "Type",
      type: "STRING",
      choices: [
        {
          name: "gempa",
          value: "gempa-terkini"
          
        },
        {
          name: "list 15 gempa (soon)",
          value: "list-gempa"
        }
      ]
    }
  ],
  execute: async(client, interaction, args) => {
    const value = interaction.options.get("type").value
    
    if(value == "gempa-terkini") {
      await axios.get(apiUrl).then(async (dataGempa) => {
        //console.log(dataGempa)
        //console.log(dataGempa.data.Infogempa.gempa)
        try {
          
          const gempa = await dataGempa.data.Infogempa.gempa
          const image = new MessageAttachment(gempa.Shakemap, "shakemap.jpg")
          const embed = new MessageEmbed()
          .setColor("BLUE")
          .setAuthor(interaction.member.user.username, interaction.member.user.displayAvatarURL({ dynamic: true }))
          .setTitle("Gempa Terkini")
          .addField("Tanggal", gempa.Tanggal)
          .addField("Jam", gempa.Jam)
          .addField("Lintang", gempa.Lintang)
          .addField("Bujur", gempa.Bujur)
          .addField("Magnitude", gempa.Magnitude)
          .addField("Kedalaman", gempa.Kedalaman)   .addField("Wilayah", gempa.Wilayah)
          .addField("Potensi", gempa.Potensi)
          .addField("Dirasakan", gempa.Dirasakan)
          .setImage("https://data.bmkg.go.id/DataMKG/TEWS/"+gempa.Shakemap)
          .setFooter("Info gempa terkini dari BMKG")
          await interaction.reply({ embeds: [embed]})
        } catch(e) {
          return interaction.reply({ content: `Something went wrong \`${e.message}\``, ephemeral: true})
          
          
        }
        
        
      })
      
    } 
    else if(value == "list-gempa") {
      return interaction.reply({ content: 'It will be update soon', ephemeral: true})
    }
  }
}
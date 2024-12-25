const { MovieDb } = require('moviedb-promise')
const moviedb = new MovieDb("PUT_YOUR_API_KEY")
const { stripIndents } = require('common-tags')
const Discord = require('discord.js')
const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require("discord.js")
const wait = require("node:timers/promises").setTimeout

module.exports = {
  name: "movie",
  description: "Search a movie by name",
  options: [
    {
      name: "search",
      description: "Please provide something to search",
      type: "STRING",
      required: true
    }
  ],
  execute: async (client, interaction, args) => {
     const [ movieName ] = args
     const msg = interaction
    //let movieName = args.join(" ")
    //if(!movieName) return msg.channel.send({ content: 'Please provide something to search' })
    await moviedb.searchMovie({
      query: movieName
    }).then(async res => {
      let id = 1
      if(res.results.length > 2) {
        const resultsData = await res.results
        const select = new MessageActionRow().addComponents(
           new MessageSelectMenu()
           .setCustomId("movie-matching")
           .setPlaceholder(`${res.results.length} matching movie`)
          .addOptions([res.results.map(movieMap => {
            return {
              label: movieMap.title, description: messageLimit(movieMap.overview), value: `${movieMap.id}`, emoji: "🎞️"
            }
          })
        ])
      )
           
         const selectRow = new MessageActionRow().addComponents(select)
         let result = res.results
      let vote = result[0].vote_count
      if(vote >= 1000) {
        vote = `${(vote/1000).toFixed(1)}k`
      }
      if(vote >= 1000000) {
        vote = `${(vote/1000000).toFixed(1)}m`
      }
      let imageUrl = `https://image.tmdb.org/t/p/original`
      let image = result[0].backdrop_path
      let poster = result[0].poster_path
      if(image === null) image = result[0].poster_path
      const embed = new Discord.MessageEmbed()
      .setColor("ORANGE")
      .setAuthor(result[0].title, imageUrl+image)
      .setDescription(result[0].overview)
      .addField("Movie Title", result[0].title)
      .addField("Movie ID", `${result[0].id}`)
      .addField("Release Date", `${result[0].release_date ? result[0].release_date : "???"}`)
      .addField("Language", `${result[0].original_language}`)
      .addField("Popularity", `${result[0].popularity}`)
      .addField("Vote", vote)
      .addField("Vote Average", generateStarRating(result[0].vote_average))
      .setImage(`https://image.tmdb.org/t/p/original${image}`)
      .setFooter('Powered By Movie Database')
      .setTimestamp()
      .setImage(imageUrl+poster)
      await interaction.deferReply()
      await wait(1000)
      const m = await interaction.editReply({ content: `I found **${res.results.length}** movie matching`, embeds: [embed], components: [select]})
      const filter = i => i.user.id === interaction.user.id
      const collector = m.createMessageComponentCollector({ componentType: "SELECT_MENU", filter, time: 120*1000})
      collector.on("collect", async i => {
         if(i.customId === "movie-matching") {
            const value = i.values[0]
            const movieData = await client.movie.movieInfo({ id: value })
            //console.log(movieData)
            const hour = Math.floor(movieData.runtime / 60)
            const minute = movieData.runtime % 60
            const movieEmbed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setAuthor(movieData.title, imageUrl+movieData.backdrop_path)
            .setDescription(movieData.overview)
            .addField("Movie Title", movieData.title)
            .addField("Movie ID", `${movieData.id}`)
            .addField("Release Date", `${movieData.release_date ? movieData.release_date : "???"}`)
            .addField("Language", `${movieData.original_language}`)
            .addField("Popularity", `${movieData.popularity}`)
            .addField("Vote", movieData.vote_count.toFixed(1))
            .addField("Vote Average", generateStarRating(movieData.vote_average))
            .addField("Runtime", `${hour} hour(s), ${minute} minute(s)`)
            .setImage(`https://image.tmdb.org/t/p/original${movieData.poster_path}`)
            .setFooter('Powered By Movie Database')
            .setImage(imageUrl+movieData.poster_path)
            .setTimestamp()
            await i.update({ embeds: [movieEmbed], components: [select]})
         }
       })
        collector.on("end", async i => {
          select.components[0].setDisabled(true)
          await interaction.editReply({ components: [select]})
        })
      } else if(res.results.length === 1) {
             let result = res.results
      let vote = result[0].vote_count
      if(vote >= 1000) {
        vote = `${(vote/1000).toFixed(1)}k`
      }
      if(vote >= 1000000) {
        vote = `${(vote/1000000).toFixed(1)}m`
      }
      let imageUrl = `https://image.tmdb.org/t/p/original`
      let image = result[0].backdrop_path
      let poster = result[0].poster_path
      if(image === null) image = result[0].poster_path
      const embed2 = new Discord.MessageEmbed()
      .setColor("ORANGE")
      .setAuthor(result[0].title, imageUrl+image)
      .setDescription(result[0].overview)
      .addField("Movie Title", result[0].title)
      .addField("Movie ID", `${result[0].id}`)
      .addField("Release Date", `${result[0].release_date ? result[0].release_date : "???"}`)
      .addField("Language", `${result[0].original_language}`)
      .addField("Popularity", `${result[0].popularity}`)
      .addField("Vote", vote)
      .addField("Vote Average", generateStarRating(result[0].vote_average))
      .setImage(`https://image.tmdb.org/t/p/original${image}`)
      .setFooter('Powered By Movie Database')
      .setTimestamp()
      .setImage(imageUrl+poster)
       return interaction.reply({ embeds: [embed2]})
      } else if(res.results.length === 0) return interaction.reply({ content: `There's no result found **${res.results.length}**`, ephemeral: true})
    }).catch(e => {
      return interaction.reply({ content: `Something went wrong \`\`\`${e.message}\`\`\``, ephemeral: true})})
  }
}

function messageLimit(str) {
  if (str.length > 45) {
      return str.substring(0, 46) + '...';
  } else {
      return str;
  }
}

function generateStarRating(voteAverage) {
    const maxStars = 10;
    const starCount = Math.floor((voteAverage / 10) * maxStars);
    const fullStars = '<:star22:1276136028465397861>'.repeat(starCount);
    const halfStar = ((voteAverage % 10) >= 5 && starCount < maxStars) ? '<:halfstar:1276136062137270403>' : '';
    const emptyStarsCount = maxStars - starCount - (halfStar.length ? 1 : 0);
    const emptyStars = ''.repeat(emptyStarsCount);

    return `${fullStars}${halfStar}${emptyStars} (${voteAverage}/10)`;
}

const { MovieDb } = require('moviedb-promise')
const moviedb = new MovieDb(process.env.MOVIE_KEY)
const { stripIndents } = require('common-tags')
const Discord = require('discord.js')


module.exports = {
  name: "movie",
  cooldown: 5,
  run: async (client, msg, args) => {
    let movieName = args.join(" ")
    if(!movieName) return msg.channel.send({ content: 'Please provide something to search' })
    moviedb.searchMovie({
      query: movieName
    }).then(res => {
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
      if(image === null) image = result[0].poster_path
      const embed = new Discord.MessageEmbed()
      .setColor("ORANGE")
      .setAuthor(result[0].title, imageUrl+image)
      .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRERFklWD4Rw6GfYosUBab6Y3hwam7vYIiXNQ&usqp=CAU')
      .setDescription(stripIndents`
      **${result[0].overview}**
      
      Name: **${result[0].title}**
      Movie ID: **${result[0].id}**
      Release: **${result[0].release_date ? result[0].release_date : "???"}**
      Popularity: **${result[0].popularity}**
      Vote: **${vote}**
      Vote Average: **${result[0].vote_average}**
      `)
      .setImage(`https://image.tmdb.org/t/p/original${image}`)
      .setFooter('Powered By Movie Database')
      .setTimestamp()
      msg.channel.send({ embeds: [embed] })
    }).catch(e => msg.channel.send({ content: '404 Not Found'}))
  }
}
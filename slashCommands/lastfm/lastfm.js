const axios = require('axios');
const { MessageSelectMenu, MessageEmbed, Modal, TextInputComponent, MessageActionRow } = require('discord.js');
const mongoose = require('mongoose');
const LastFmUser = require("../../models/lastfm")
const wait = require('node:timers/promises').setTimeout;
const spotifyClientId = 'PUT_YOUR_CLIENT_ID';
const spotifyClientSecret = 'PUT_YOUR_CLIENT_ID';

module.exports = {
  name: "lastfm",
  description: "Shows the current scrobbling song and the previous track",
  options: [
    {
      name: "user",
      description: "Tag any user to check",
      required: false,
      type: "USER"
    }
  ],
  execute: async (client, interaction, args) => {
    const target = interaction.options.getUser('user') || interaction.user;
    const user = await LastFmUser.findOne({ id: target.id });

    if (!user) {
      return interaction.reply({ content: `❌ Couldn't find any data, make sure you/they run the command /lastfm-set first`, ephemeral: true });
    }

    const apiKey = '11dfb00ef56ac9c6b588f4d9630c2082';
    const lastFmUsername = user.lastFmUsername;

    const recentTracksUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFmUsername}&api_key=${apiKey}&format=json&limit=2`;
    const userInfoUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${lastFmUsername}&api_key=${apiKey}&format=json`;

    try {
      const [recentTracksResponse, userInfoResponse] = await Promise.all([
        axios.get(recentTracksUrl),
        axios.get(userInfoUrl),
      ]);

      const recentTracksData = recentTracksResponse.data;
      const userInfoData = userInfoResponse.data;

      if (recentTracksData.recenttracks.track.length > 0) {
        const currentTrack = recentTracksData.recenttracks.track[0];
        const previousTrack = recentTracksData.recenttracks.track[1] || currentTrack;
        const trackPlaycount = await getTrackPlaycount(apiKey, lastFmUsername, currentTrack);
        const totalScrobbles = userInfoData.user.playcount;
        let imageUrl = await getTrackImage(currentTrack, spotifyClientId, spotifyClientSecret, apiKey); 
        //console.log(currentTrack.artist['#text'])
        const select = new MessageSelectMenu()
        .setCustomId("lastfm-account")
        .setPlaceholder("Account Settings")
        .addOptions([
          {
            label: "Account Information",
            description: "Your Last.fm information",
            emoji: "🧾",
            value: "info-username"
          },
          {
            label: "Update Username",
            description: "To update your Last.fm username",
            emoji: "📝",
            value: "updt-username",
          },
          {
            label: "Delete Username",
            description: "Delete your Last.fm username",
            emoji: "⚙️",
            value: "dlt-username"
          },
          {
            label: "Refresh",
            description: "Refresh if you change your username",
            emoji: "🔄",
            value: "refresh"
          }
        ])
        const selectRow = new MessageActionRow().addComponents(select)
        const lastFmEmbed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Now Playing - ${target.displayName}`, target.displayAvatarURL({ dynamic: true }))
        .setThumbnail(imageUrl)
        .addField("Current", `[${currentTrack.name}](${getTrackUrl(currentTrack)})\n${currentTrack.artist['#text']} • ${currentTrack.album['#text']}`)
        .addField("Previous", `[${previousTrack.name}](${getTrackUrl(previousTrack)})\n${previousTrack.artist['#text']} • ${previousTrack.album['#text']}`)
        .setFooter(`${trackPlaycount} track scrobbles • ${totalScrobbles} total scrobbles`)
        if(target.id === interaction.user.id) {
          await interaction.deferReply()
          await wait(1000)
          const m = await interaction.editReply({ embeds: [lastFmEmbed], components: [selectRow]})
          const filter = i => i.user.id === interaction.user.id
          const collector = m.createMessageComponentCollector({ componentType: "SELECT_MENU", filter, time: 120*1000 })
          collector.on("collect", async i => {
            if(i.customId === "lastfm-account") {
              const value = i.values[0]
              if(value === "info-username") {
                const Data = await LastFmUser.findOne({ id: interaction.user.id })
                if(!Data) return i.reply({ content: ":x: Could not find Last.fm data", ephemeral: true})
                const Embed = new MessageEmbed()
                .setColor("GREEN")
                .addField("Discord ID", target.id)
                .addField("Last.fm Username", Data.lastFmUsername)
                .setTimestamp()
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
                await i.reply({ embeds: [Embed], ephemeral: true})
              }
              if(value === "updt-username") {
                const Data = await LastFmUser.findOne({ id: interaction.user.id })
                if(!Data) return i.reply({ content: ":x: Could not find Last.fm data", ephemeral: true })
                const modal = new Modal()
                .setCustomId(`updt-${interaction.user.id}`)
                .setTitle("Update Last.fm Username")
                const usernameText = new TextInputComponent()
                .setCustomId(`username-${interaction.user.id}`)
                .setPlaceholder("Your new username")
                .setLabel("Username")
                .setRequired(true)
                .setStyle("SHORT")
                const modalSubmit = new MessageActionRow().addComponents(usernameText)
                modal.addComponents(modalSubmit)
                await i.showModal(modal)
            }
            if(value === "dlt-username") {
              const Data = await LastFmUser.findOne({ id: interaction.user.id })
              if(!Data) return i.reply({ content: ":x: Could not find Last.fm data", ephemeral: true})
              await LastFmUser.deleteMany({ id: interaction.user.id })
              const newEmbed = new MessageEmbed()
              .setColor("BLUE")
              .setDescription("No recent tracks found")
              await i.update({ embeds: [newEmbed], components: []})
              await interaction.editReply({ content: "Your Last.fm data has been deleted", ephemeral: true })
            }
              if(value === "refresh") {
                const Data = await LastFmUser.findOne({ id: interaction.user.id });
                if(!Data) return i.reply({ content: ":x: Could not find Last.fm data", ephemeral: true})
                const recentTracksUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${Data.lastFmUsername}&api_key=${apiKey}&format=json&limit=2`;
                const userInfoUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${Data.lastFmUsername}&api_key=${apiKey}&format=json`;
                try {
                const [recentTracksResponse, userInfoResponse] = await Promise.all([
                  axios.get(recentTracksUrl),
                  axios.get(userInfoUrl),
                ]);
                const recentTracksData = recentTracksResponse.data;
                const userInfoData = userInfoResponse.data;

                if(recentTracksData.recenttracks.track.length > 0) {
                  const currentTrack = recentTracksData.recenttracks.track[0];
                  const previousTrack = recentTracksData.recenttracks.track[1] || currentTrack;
                  const trackPlaycount = await getTrackPlaycount(apiKey, lastFmUsername, currentTrack);
                  const totalScrobbles = userInfoData.user.playcount;
                  let imageUrl = await getTrackImage(currentTrack, spotifyClientId, spotifyClientSecret, apiKey); 
                  const lastFmEmbed = new MessageEmbed()
                  .setColor("BLUE")
                  .setAuthor(`Now Playing - ${target.displayName}`, target.displayAvatarURL({ dynamic: true }))
                  .setThumbnail(imageUrl)
                  .addField("Current", `[${currentTrack.name}](${getTrackUrl(currentTrack)})\n${currentTrack.artist['#text']} • ${currentTrack.album['#text']}`)
                  .addField("Previous", `[${previousTrack.name}](${getTrackUrl(previousTrack)})\n${previousTrack.artist['#text']} • ${previousTrack.album['#text']}`)
                  .setFooter(`${trackPlaycount} track scrobbles • ${totalScrobbles} total scrobbles`)
                  await i.update({ embeds: [lastFmEmbed], components: [selectRow]})
              } else {
                return i.reply({ content: "Still no current tracks", ephemeral: true })
               }
              } catch(e) {
                return i.reply({ content: "There was an error fetching your Last.fm data"})
               }
              }
           }
         })
          collector.on("end", async i => {
            select.setDisabled(true)
            await interaction.editReply({ components: [selectRow]})
          })
        } else {
          await interaction.reply({ embeds: [lastFmEmbed] })
        }
      } else {
        const select = new MessageSelectMenu()
        .setCustomId("lastfm-account")
        .setPlaceholder("Account Settings")
        .addOptions([
          {
            label: "Account Information",
            description: "Your Last.fm information",
            emoji: "🧾",
            value: "info-username"
          },
          {
            label: "Update Username",
            description: "To update your Last.fm username",
            emoji: "📝",
            value: "updt-username",
          },
          {
            label: "Delete Username",
            description: "Delete your Last.fm username",
            emoji: "⚙️",
            value: "dlt-username"
          },
          {
            label: "Refresh",
            description: "Refresh if you change your username",
            emoji: "🔄",
            value: "refresh"
          }
        ])
        const selectRow = new MessageActionRow().addComponents(select)
        await interaction.deferReply()
        await wait(1000)
        const m = await interaction.editReply({ content: 'No recent tracks found.', components: [selectRow], ephemeral: true })
          const filter = i => i.user.id === interaction.user.id
          const collector = m.createMessageComponentCollector({ componentType: "SELECT_MENU", filter, time: 120*1000 })
          collector.on("collect", async i => {
            if(i.customId === "lastfm-account") {
              const value = i.values[0]
              if(value === "info-username") {
                const Data = await LastFmUser.findOne({ id: interaction.user.id })
                if(!Data) return i.reply({ content: ":x: Could not find Last.fm data", ephemeral: true})
                const Embed = new MessageEmbed()
                .setColor("GREEN")
                .addField("Discord ID", target.id)
                .addField("Last.fm Username", Data.lastFmUsername)
                .setTimestamp()
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
                await i.reply({ embeds: [Embed], ephemeral: true})
              }
              if(value === "updt-username") {
                const Data = await LastFmUser.findOne({ id: interaction.user.id })
                if(!Data) return i.reply({ content: ":x: Could not find Last.fm data", ephemeral: true })
                const modal = new Modal()
                .setCustomId(`updt-${interaction.user.id}`)
                .setTitle("Update Last.fm Username")
                const usernameText = new TextInputComponent()
                .setCustomId(`username-${interaction.user.id}`)
                .setPlaceholder("Your new username")
                .setLabel("Username")
                .setRequired(true)
                .setStyle("SHORT")
                const modalSubmit = new MessageActionRow().addComponents(usernameText)
                modal.addComponents(modalSubmit)
                await i.showModal(modal)
            }
            if(value === "dlt-username") {
              const Data = await LastFmUser.findOne({ id: interaction.user.id })
              if(!Data) return i.reply({ content: ":x: Could not find Last.fm data", ephemeral: true})
              await LastFmUser.deleteMany({ id: interaction.user.id })
              const newEmbed = new MessageEmbed()
              .setColor("BLUE")
              .setDescription("No recent tracks found")
              await i.update({ embeds: [newEmbed], components: [selectRow]})
              await i.reply({ content: "Your Last.fm data has been deleted", ephemeral: true })
            }
              if(value === "refresh") {
                const Data = await LastFmUser.findOne({ id: interaction.user.id });
                if(!Data) return i.reply({ content: ":x: Could not find Last.fm data", ephemeral: true})
                const recentTracksUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${Data.lastFmUsername}&api_key=${apiKey}&format=json&limit=2`;
                const userInfoUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${Data.lastFmUsername}&api_key=${apiKey}&format=json`;
                try {
                const [recentTracksResponse, userInfoResponse] = await Promise.all([
                  axios.get(recentTracksUrl),
                  axios.get(userInfoUrl),
                ]);
                const recentTracksData = recentTracksResponse.data;
                const userInfoData = userInfoResponse.data;

                if(recentTracksData.recenttracks.track.length > 0) {
                  const currentTrack = recentTracksData.recenttracks.track[0];
                  const previousTrack = recentTracksData.recenttracks.track[1] || currentTrack;
                  const trackPlaycount = await getTrackPlaycount(apiKey, lastFmUsername, currentTrack);
                  const totalScrobbles = userInfoData.user.playcount;
                  let imageUrl = await getTrackImage(currentTrack, spotifyClientId, spotifyClientSecret, apiKey); 
                  const lastFmEmbed = new MessageEmbed()
                  .setColor("BLUE")
                  .setAuthor(`Now Playing - ${target.displayName}`, target.displayAvatarURL({ dynamic: true }))
                  .setThumbnail(imageUrl)
                  .addField("Current", `[${currentTrack.name}](${getTrackUrl(currentTrack)})\n${currentTrack.artist['#text']} • ${currentTrack.album['#text']}`)
                  .addField("Previous", `[${previousTrack.name}](${getTrackUrl(previousTrack)})\n${previousTrack.artist['#text']} • ${previousTrack.album['#text']}`)
                  .setFooter(`${trackPlaycount} track scrobbles • ${totalScrobbles} total scrobbles`)
                  await i.update({ embeds: [lastFmEmbed], components: [selectRow]})
              } else {
                return i.reply({ content: "Still no current tracks", ephemeral: true })
               }
              } catch(e) {
                return i.reply({ content: "There was an error fetching your Last.fm data"})
               }
              }
           }
         })
          collector.on("end", async i => {
            select.setDisabled(true)
            await interaction.editReply({ components: [selectRow]})
          })
      }
    } catch (error) {
      console.error('Error fetching Last.fm data:', error);
      await interaction.reply({ content: 'There was an error fetching your Last.fm data.', ephemeral: true });
    }
  },
};

async function getSpotifyAccessToken() {
  const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString('base64'),
    },
  });
  return response.data.access_token;
}

async function getTrackPlaycount(apiKey, username, track) {
  const trackInfoUrl = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(track.artist['#text'])}&track=${encodeURIComponent(track.name)}&username=${username}&format=json`;
  try {
    const response = await axios.get(trackInfoUrl);
    return response.data.track.userplaycount || "0";
  } catch (error) {
    console.error('Error fetching track playcount:', error);
    return "0";
  }
}

function getTrackUrl(track) {
  return `https://www.last.fm/music/${encodeURIComponent(track.artist['#text'])}/_/${encodeURIComponent(track.name)}`;
}

async function getTrackImage(track, clientId, clientSecret, apiKey) {
  const spotifyAccessToken = await getSpotifyAccessToken(clientId, clientSecret);
  
  
  let query = `track:${encodeURIComponent(track.name)} artist:${encodeURIComponent(track.artist['#text'])} album:${encodeURIComponent(track.album['#text'])}`;
  let imageUrl = await searchSpotifyForImage(query, spotifyAccessToken);

  if (imageUrl) {
    return imageUrl;
  }
  query = `track:${encodeURIComponent(track.name)} artist:${encodeURIComponent(track.artist['#text'])}`;
  imageUrl = await searchSpotifyForImage(query, spotifyAccessToken);

  if (imageUrl) {
    return imageUrl;
  }
  return track.image.find(img => img.size === 'large')['#text'] || 'https://via.placeholder.com/150';
}

async function searchSpotifyForImage(query, accessToken) {
  try {
    const searchResponse = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    if (searchResponse.data.tracks.items.length > 0 && searchResponse.data.tracks.items[0].album.images.length > 0) {
      return searchResponse.data.tracks.items[0].album.images[0].url;
    }
  } catch (error) {
    console.error('Error searching Spotify for image:', error);
  }
  return null; 
}

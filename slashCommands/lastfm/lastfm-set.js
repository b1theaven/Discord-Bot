const { MessageEmbed } = require('discord.js');
const apiKey = 'PUT_YOUR_API_KEY';
const mongoose = require('mongoose');
const LastFmUser = require("../../models/lastfm")
const axios = require('axios')
const { stripIndents } = require('common-tags')
const wait = require("node:timers/promises").setTimeout
module.exports = {
  name: "lastfm-set",
  description: "Set your last.fm username",
  options: [
    {
      name: "username",
      description: "Your Last.fm username",
      type: "STRING",
      required: true
    }
  ],
  execute: async (client, interaction, args) => {
    const username = interaction.options.getString('username');
    const userId = interaction.user.id;
    await interaction.deferReply()
    await wait(1000)
    const messageSent = await interaction.editReply({ content: `[!] ${client.user.username} tries to login to https://www.last.fm/`, ephemeral: true})
    
    setTimeout(async function() {
      messageSent.edit({ content: `[!] ${client.user.username} tries to login to https://www.last.fm/\n[!] Logged in...`, ephemeral: true})
    }, 2000)
    setTimeout(async function() {
      messageSent.edit({ content: `[!] ${client.user.username} tries to login to https://www.last.fm/\n[!] Logged in...\n[!] Search for Last.fm username \`${username}\``, ephemeral: true})
    }, 2000)
    setTimeout(async function() {
      try {
    const userInfoUrl = `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${apiKey}&format=json`;
    const [userInfoResponse] = await Promise.all([
        axios.get(userInfoUrl),
      ])
    } catch(e) {
      if(e) return messageSent.edit({ content: `[!] ${client.user.username} tries to login to https://www.last.fm/\n[!] Logged in...\n[!] Search for Last.fm username \`${username}\`...\n[!] Can't find username...`, ephemeral: true})
    }
    const data = await LastFmUser.findOne({ id: userId})
    if(!data) {
      await LastFmUser.create({
        id: userId,
        lastFmUsername: username
      })
      await messageSent.edit({ content: `[!] ${client.user.username} tries to login to https://www.last.fm/\n[!] Logged in...\n[!] Search for Last.fm username \`${username}\`...\n[✔] \`${username}\`Your Last.fm username has been set up!`, ephemeral: true})
    } else {
      await messageSent.edit({ content: `[!] ${client.user.username} tries to login to https://www.last.fm/\n[!] Logged in...\n[!] Search for Last.fm username \`${username}\`...\n[x] Your last.fm username has been set up before!`, ephemeral: true })
    }
   }, 3000)
  }
};
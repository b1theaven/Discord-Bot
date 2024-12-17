const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const mongoose = require('mongoose');
const LastFmUser = require('../../models/lastfm')
const collectorMap = new Map();
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')

module.exports = {
  name: "lastfm-top",
  ownerOnly: true,
  description: "Shows your top 10 artists and albums",
  options: [
    {
      name: 'type',
      description: "Search: artists, albums, or tracks",
      type: "STRING",
      required: true,
      choices: [
        {
          name: "Artists",
          value: "artists"
        },
        {
          name: "Albums",
          value: 'albums'
        },
        {
          name: "Tracks",
          value: "tracks"
        }
      ]
    },
    {
      name: "time",
      description: "Time stamp for the search",
      required: true,
      type: "STRING",
      choices: [
        {
          name: "Weekly",
          value: "7day"
        },
        {
          name: "Monthly",
          value: "1month"
        },
        {
          name: "Quarterly",
          value: '3month'
        },
        {
          name: "Half-Yearly",
          value: "6month"
        },
        {
          name: "Yearly",
          value: "12month"
        },
        {
          name: "All Time",
          value: "overall"
        }
      ]
    },
    {
      name: "member",
      type: "USER",
      description: "Members to check",
      required: false
    }
  ],
  execute: async (client, interaction, args) => {
    await interaction.deferReply();
    const type = interaction.options.getString('type');
    const timeChoice = interaction.options.getString('time');
    const timeMapping = {
      '7day': 'weekly',
      '1month': 'monthly',
      '3month': 'quarterly',
      '6month': 'half-yearly',
      '12month': 'yearly',
      'overall': 'alltime'
    };
    const time = timeMapping[timeChoice].toLowerCase();
    const apiKey = '11dfb00ef56ac9c6b588f4d9630c2082';
    const target = interaction.options.getUser('member') || interaction.user;
    const ITEMS_PER_PAGE = 10;
    let page = 1;

        try {
            const user = await LastFmUser.findOne({ id: target.id });
            if (!user) {
                return interaction.editReply({ content: `❌ Couldn't find any data, make sure you/they run the command /lastfm-set first`, ephemeral: true });
            }
            const lastFmUsername = user.lastFmUsername;

            let methodSuffix;
            switch (type) {
                case 'artists':
                    methodSuffix = 'gettopartists';
                    break;
                case 'albums':
                    methodSuffix = 'gettopalbums';
                    break;
                case 'tracks':
                    methodSuffix = 'gettoptracks';
                    break;
            }

            const url = `http://ws.audioscrobbler.com/2.0/?method=user.${methodSuffix}&user=${encodeURIComponent(lastFmUsername)}&api_key=${apiKey}&format=json&period=${timeChoice}&limit=${ITEMS_PER_PAGE}&page=${page}`;
            const response = await axios.get(url);

            const items = response.data.topartists?.artist || response.data.topalbums?.album || response.data.toptracks?.track;
            if (!items) {
                throw new Error('Failed to retrieve data');
            }

            const topItems = items.map((item, index) => {
                const name = item.name;
                const playcount = item.playcount;
                const artist = item.artist?.name || ""; 
                const url = item.url;
                const formattedName = type === 'artists' ? `**[${name}](${url})**` :
                    type === 'tracks' ? `**${artist}** - [**${name}**](${url})` :
                    type === 'albums' ? `**${artist}** - [**${name}**](${url})` : ""; 
                return `${index + 1 + (page - 1) * ITEMS_PER_PAGE}. ${formattedName} - *${playcount} plays*`;
            }).join('\n');

            const totalScrobbles = items.reduce((acc, item) => acc + parseInt(item.playcount, 10), 0);
            const category = type.charAt(0).toUpperCase() + type.slice(1); 

            const Embed = new MessageEmbed()
            .setColor("PURPLE")
            .setDescription(`${topItems}`)
            .setAuthor(`Top ${time} ${category.toLowerCase()} for ${target.displayName}`, interaction.user.displayAvatarURL({ dynamic: true }))
            .setFooter(`${totalScrobbles} total ${type} in this time period | Page ${page}`)
            const Button1 = new MessageButton()
            .setCustomId("previous_page")
            .setStyle("PRIMARY")
            .setLabel("Previous")
            .setDisabled(page === 1)
            const Button2 = new MessageButton()
            .setCustomId("next_page")
            .setStyle("PRIMARY")
            .setLabel("Next")
            const row = new MessageActionRow().addComponents(Button1, Button2)
            const m = await interaction.editReply({ embeds: [Embed], components: [row] });

            const filter = i => i.customId === 'previous_page' || i.customId === 'next_page';
            const collector = m.createMessageComponentCollector({ filter, time: 120*1000 });

            collector.on('collect', async i => {
                if (i.customId === 'previous_page' && page > 1) {
                   page --;
                   row.components[0].disabled = true
                } else if (i.customId === 'next_page') {
                    page += 1;
                }

                const newUrl = `http://ws.audioscrobbler.com/2.0/?method=user.${methodSuffix}&user=${encodeURIComponent(lastFmUsername)}&api_key=${apiKey}&format=json&period=${timeChoice}&limit=${ITEMS_PER_PAGE}&page=${page}`;
                const newResponse = await axios.get(newUrl);

                const newItems = newResponse.data.topartists?.artist || newResponse.data.topalbums?.album || newResponse.data.toptracks?.track;
                const newTopItems = newItems.map((item, index) => {
                    const name = item.name;
                    const playcount = item.playcount;
                    const artist = item.artist?.name || ""; 
                    const url = item.url;
                    const formattedName = type === 'artists' ? `**[${name}](${url})**` :
                        type === 'tracks' ? `**${artist}** - [**${name}**](${url})` :
                        type === 'albums' ? `**${artist}** - [**${name}**](${url})` : "";
                    return `${index + 1 + (page - 1) * ITEMS_PER_PAGE}. ${formattedName} - *${playcount} plays*`;
                }).join('\n');

                const newTotalScrobbles = newItems.reduce((acc, item) => acc + parseInt(item.playcount, 10), 0);
              const Embed2 = new MessageEmbed()
              .setColor("PURPLE")
              .setDescription(`${newTopItems}`)
              .setAuthor(`Top ${time} ${category.toLowerCase()} for ${target.displayName}`, interaction.user.displayAvatarURL({ dynamic: true }))
              .setFooter(`${newTotalScrobbles} total ${type} in this time period | Page ${page}`)
                if (Embed2.footer.text.includes("Page 2")) {
                    row.components[0].disabled = false;
                }

                await i.update({ embeds: [Embed2], components: [row] });
            });

            collector.on('end', async collected => {
              Button1.setDisabled(true)
              Button2.setDisabled(true)
              await interaction.editReply({ components: [row]})
                if (collected.size === 0) {
                    interaction.followUp({ content: 'Interaction timeout.', ephemeral: true });
                }
                collector.stop();
                collectorMap.delete(interaction.id);
            });
            collectorMap.set(interaction.id, collector);

        } catch (error) {
            console.error('Error fetching top items:', error);
            await interaction.editReply({ content: 'An error occurred while fetching your top items. Please try again later.', ephemeral: true });
        }
    }
};

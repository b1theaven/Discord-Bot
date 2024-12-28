const { MessageEmbed } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
    name: "radio",
    description: "Plays some radio music",
    options: [
        {
            name: "station",
            description: "Select which station you want",
            required: true,
            type: "STRING",
            choices: [
                {
                    name: `Lofi`,
                    value: `http://lofi.stream.laut.fm/lofi?t302=2023-05-09_19-27-21&uuid=d646c9fa-d187-47d6-974c-adb3d6c36a66` },
        { name: `Radio`, value: `https://streams.ilovemusic.de/iloveradio1.mp3` },
        { name: `Dance`, value: `https://streams.ilovemusic.de/iloveradio2.mp3` },
        { name: `Dance 2023`, value: `https://streams.ilovemusic.de/iloveradio36.mp3` },
        { name: `Dance First`, value: `https://streams.ilovemusic.de/iloveradio103.mp3` },
        { name: `Dance History`, value: `https://streams.ilovemusic.de/iloveradio26.mp3` },
        { name: `2000+ Throwbacks`, value: `https://streams.ilovemusic.de/iloveradio37.mp3` },
        { name: `2010+ Throwbacks`, value: `https://streams.ilovemusic.de/iloveradio38.mp3` },
        { name: `Bass by HBZ`, value: `https://streams.ilovemusic.de/iloveradio29.mp3` },
        { name: `Chill Pop`, value: `https://streams.ilovemusic.de/iloveradio17.mp3` },
        { name: `Greatest Hits`, value: `https://streams.ilovemusic.de/iloveradio16.mp3` },
        { name: `Hard Style`, value: `https://streams.ilovemusic.de/iloveradio21.mp3` },
        { name: `Hip Hop`, value: `https://streams.ilovemusic.de/iloveradio3.mp3` },
        { name: `Hip Hop 2023`, value: `https://streams.ilovemusic.de/iloveradio35.mp3` },
        { name: `Main Stage`, value: `https://streams.ilovemusic.de/iloveradio22.mp3` },
        { name: `Rock`, value: `https://streams.ilovemusic.de/iloveradio4.mp3` },
        { name: `The 90s`, value: `https://streams.ilovemusic.de/iloveradio24.mp3` },
        { name: `Workout`, value: `https://streams.ilovemusic.de/iloveradio23.mp3` },
        { name: `XMAS`, value: `https://streams.ilovemusic.de/iloveradio8.mp3` }
            ]
        }
    ],

    execute: async (client, interaction, args) => {

        let audioURL = await interaction.options.get('station').value

        if (!interaction.member.voice.channel) {
            await interaction.reply({ content: 'You must be in a **voice channel** to use this command.', ephemeral:true });
        return;
        }

        const connection = joinVoiceChannel({ channelId: interaction.member.voice.channel.id, guildId: interaction.guild.id, adapterCreator: interaction.guild.voiceAdapterCreator });

        const audioPlayer = createAudioPlayer();
        connection.subscribe(audioPlayer);

        const audioResource = createAudioResource(audioURL);
        audioPlayer.play(audioResource);

        const embed = new MessageEmbed()
        .setColor("BLUE")
        .setThumbnail(client.user.avatarURL())
        .setAuthor(`${client.user.username} Radio`)
        .setTimestamp()
        .setTitle(`Radio Started`)
        .setDescription(` ${interaction.user.username} has started the radio in ${interaction.member.voice.channel.name}!`)
        .addFields({ name: `Radio Stream`, value: `> ${audioURL}`})

        await interaction.reply({ embeds: [embed] });

    },
}
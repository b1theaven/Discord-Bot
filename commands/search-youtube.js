const axios = require('axios');

module.exports = {
    name: 'search-youtube',
    aliases: ['youtube'],
    description: 'Search for a YouTube video by title',
    run: async (client, message, args) => {
        if (args.length === 0) {
            return message.reply('Please provide a title to search for.');
        }

        const query = args.join(' ');
        const apiKey = 'PUT_API_KEY_HERE';
        const url = `https://www.googleapis.com/youtube/v3/search`;

        try {
            const response = await axios.get(url, {
                params: {
                    part: 'snippet',
                    q: query,
                    type: 'video',
                    order: 'relevance',
                    maxResults: 1,
                    key: apiKey,
                },
            });

            const video = response.data.items[0];

            if (video) {
                const videoId = video.id.videoId;
                const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                message.channel.send(`${videoUrl}`);
            } else {
                message.reply('No results found.');
            }
        } catch (error) {
            console.error('Error fetching YouTube data:', error);
            message.reply('An error occurred while searching for YouTube videos.');
        }
    },
};
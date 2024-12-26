const { MessageAttachment } = require("discord.js")
const axios = require('axios');
const sharp = require('sharp');

module.exports = {
    name: "photosize",
    description: "Resize an image to specified width and height",
    options: [
        {
            name: "Image",
            description: "Provide your image here",
            type: "ATTACHMENT",
            required: true
        },
        {
            name: "width",
            description: "Width to resize the image",
            type: "NUMBER",
            required: true
        },
        {
            name: "height",
            description: "Height to reize the image",
            type: "NUMBER",
            required: true
        }
    ],
  run: async (client, interaction, args) => {
    const imageUrl = interaction.options.getAttachment('image')
    const width = interaction.options.getNumber('width');
    const height = interaction.options.getNumber('height');
      if(imageUrl.contentType === "video/quicktime") {
          return interaction.reply({ content: "The image is not valid", ephemeral: true })
      }

    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data);

      const resizedImageBuffer = await sharp(imageBuffer)
        .resize(width, height)
        .toBuffer();

      const attachment = new MessageAttachment(resizedImageBuffer, { name: `resized-${width}x${height}.png` });

      await interaction.reply({ files: [attachment] });
    } catch (error) {
      console.error('Error processing image:', error);
      return interaction.reply({ content: 'There was an error processing the image. Please make sure the URL is valid.' });
    }
  }
}

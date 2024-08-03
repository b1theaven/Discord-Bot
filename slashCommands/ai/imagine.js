const { SlashCommandBuilder } = require('discord.js');
const { Prodia } = require("prodia.js");
const prodia = new Prodia("PUT_API_KEY_HERE")

module.exports = {
  name: "imagine",
  description: "Imagine by AI",
  options: [
    { name: "prompt", description: "Imagine gambar yang ingin di buat", required: true, type: "STRING" }, 
    { name: "negative_prompt", description: "False", type: "STRING", required: false}],
  execute: async (client, interaction, args) => {
        const prompt = interaction.options.getString("prompt");
                const negativePrompt = interaction.options.getString("negative_prompt"); 
        const msg = await interaction.reply({
            content: "Generating Images...."
        });
        try {
            const generatedImages = await Promise.all([
                generateImage(prompt, negativePrompt),
                generateImage(prompt, negativePrompt),
                generateImage(prompt, negativePrompt),
                generateImage(prompt, negativePrompt)
            ]);

        
            const imageAttachments = generatedImages.map((image, index) => ({
                name: `generated_image_${index + 1}.png`,
                attachment: image.imageUrl
            }));

            await interaction.followUp({
                content: "Correctly generated images.",
                files: imageAttachments
            });
        } catch (error) {
            console.error(error);
            return msg.edit({ content: "Error generating the images." });
        }
    }
};

async function generateImage(prompt, negativePrompt) {
    try {
        const generate = await prodia.generateImage({
        negative_prompt: negativePrompt ,
        prompt: prompt,
        model: "absolutereality_v181.safetensors [3d9d4d2b]",
        negative_prompt: "text, blur, duplicate, distorted",
        sampler: "DPM++ SDE Karras",
        cfg_scale: 19,
        steps: 30,
        aspect_ratio: "portrait"

  
        });

        while (generate.status !== "succeeded" && generate.status !== "failed") {
            await new Promise((resolve) => setTimeout(resolve, 350));
            const job = await prodia.getJob(generate.job);

            if (job.status === "succeeded") {
                return job;
            }
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}
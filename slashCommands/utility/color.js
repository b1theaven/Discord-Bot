const { MessageEmbed } = require("discord.js");
const Color = require("color");

module.exports = {
  name: "color",
  description: "Get various color formats from a color name or hex code",
  options: [
    {
      name: "input",
      description: "The color name or hex code",
      required: true,
      type: "STRING",
    },
  ],
  execute: async (client, interaction, args) => {
    let input = interaction.options.getString("input").trim();

    if (input.charAt(0) === input.charAt(0).toUpperCase()) {
      input = input.toLowerCase();
    }

    let color;
    try {
      color = Color(input);
    } catch (error) {
      await interaction.reply({
        content: "Invalid color input...",
        ephemeral: true,
      });
      return;
    }

    const hex = color.hex();
    const rgb = color.rgb().string();
    const hsl = color.hsl().string();
    const cmyk = color.cmyk().array();
    const cmykFormatted = `cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)`;
    const hsv = color.hsv().string();
    const lab = color.lab().array().join(", ");
    const xyz = color.xyz().array().join(", ");
    const lch = color.lch().array().join(", ");

    const embed = new MessageEmbed()
      .setColor(parseInt(hex.replace("#", ""), 16))
      .addFields(
        { name: "**HEX**", value: `\`\`\`${hex}\`\`\``, inline: true },
        { name: "**RGB**", value: `\`\`\`${rgb}\`\`\``, inline: true },
        { name: "**HSL**", value: `\`\`\`${hsl}\`\`\``, inline: true },
        {
          name: "**CMYK**",
          value: `\`\`\`${cmykFormatted}\`\`\``,
          inline: true,
        },
        { name: "**HSV**", value: `\`\`\`${hsv}\`\`\``, inline: true },
        { name: "**LAB**", value: `\`\`\`${lab}\`\`\``, inline: true },
        { name: "**XYZ**", value: `\`\`\`${xyz}\`\`\``, inline: true },
        { name: "**LCH**", value: `\`\`\`${lch}\`\`\``, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  },
};

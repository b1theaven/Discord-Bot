const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

exports.run = async (client, message, args) => {
  const user = message.mentions.users.first() || message.author;
  const userData = await client.users.fetch(user.id, { force: true });

  let response = fetch(`https://discord.com/api/v8/users/${user.id}`, {
    method: "GET",
    headers: {
      Authorization: `Bot ${client.token}`,
    },
  });

  let receive = "";
  let bannerGet = "";

  response.then(async (a) => {
    if (a.status !== 404) {
      a.json().then(async (data) => {
        receive = data["banner"];

        if (receive !== null) {
          let format = "png";
          if (receive.substring(0, 2) === "a_") {
            format = "gif";
          }

          bannerGet = `https://cdn.discordapp.com/banners/${user.id}/${receive}.${format}`;

          if (!userData.banner) {
            return message.reply(
              `❌ ${user.username} tidak memiliki banner profil.`
            );
          }

          const bannerURL = `https://cdn.discordapp.com/banners/${user.id}/${userData.banner}?size=4096&dynamic=true`;
          console.log(bannerGet);
          const embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(`Banner ${user.username}`)
            .setImage(
              `https://cdn.discordapp.com/banners/${user.id}/${receive}.${format}?size=4096`
            )
            .setFooter(
              `Diminta oleh ${message.author.username}`,
              message.author.displayAvatarURL({ dynamic: true })
            );

          await message.channel.send({ embeds: [embed] });
        }
      });
    }
  });
};

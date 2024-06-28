const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

const choice = ["✅", "❌"];
const channelBug = "1256303202005942292";

module.exports = {
    name: "reportbug",
    aliases: ['report'],
    cooldown: 90,
    run: async (client, msg, args) => {
        const bug = args.join(" ");
        if (!bug) return msg.channel.send({ content: "Please enter the bug type" });

        // Menghapus pesan pengguna setelah perintah dikirim
        msg.delete().catch(err => console.log(err));

        // Mengirim pesan konfirmasi dan menghapusnya setelah 5 detik
        msg.channel.send({ content: "Thank you for your report" }).then(m => {
            setTimeout(() => m.delete().catch(err => console.log(err)), 5000);
        });

        const bugEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("New Reported")
            .setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
            .setDescription(stripIndents`
                From: ${msg.member.user.tag}
                Report: \`${bug}\`
            `);

        client.channels.cache.get(channelBug).send({ embeds: [bugEmbed] });
    }
};
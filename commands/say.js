module.exports = {
  name: "say",
  run: async (client, msg, args) => {
    let say = args.join(" ");
    const imagesSend = msg.attachments.first();
    console.log(imagesSend);

    // Role yang diizinkan
    const allowedRoles = [
      "ADMIN_ID",
      "ADMIN_ID",
      "ADMIN_ID",
      "ADMIN_ID",
      "ADMIN_ID",
    ];

    if (imagesSend) {
      await msg.delete();
      return msg.channel.send({ content: imagesSend.url });
    } else if (!say) {
      await msg.channel.send("Example: <prefix>.say test");
      return msg.delete();
    }

    if (say.length > 250) {
      await msg.channel.send("The maximum character was 250");
      return msg.delete();
    }

    // Cek apakah user memiliki role yang diizinkan
    const hasAllowedRole = msg.member.roles.cache.some((role) =>
      allowedRoles.includes(role.id)
    );

    // Jika user tidak memiliki role yang diizinkan dan mencoba mention @everyone atau @here, kirim pesan ephemeral
    if (
      !hasAllowedRole &&
      (say.includes("@everyone") || say.includes("@here"))
    ) {
      return msg.reply({
        content:
          "❌ Anda tidak dapat menggunakan `@everyone` atau `@here` dalam perintah ini!",
      });
    }

    await msg.channel.send(say);
    msg.delete();
  },
};

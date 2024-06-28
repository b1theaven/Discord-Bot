module.exports = {
    name: "Say",
    run: async (client, msg, args) => {
      let say = args.join(" ");
  
      if (!say) {
        await msg.channel.send(await client.translate("Example: <prefix>.say test", msg));
        return msg.delete(); // Menghapus pesan pengguna jika tidak ada teks
      }
  
      if (say.length > 250) {
        await msg.channel.send(await client.translate("The maximum character was 250", msg));
        return msg.delete(); // Menghapus pesan pengguna jika teks melebihi 250 karakter
      }
  
      say = say.replace("@everyone", "@everyone").replace("@here", "@here");
  
      await msg.channel.send(say);
      msg.delete(); // Menghapus pesan pengguna setelah bot mengirimkan pesan
    }
  };
  
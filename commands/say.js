module.exports = {
  name: "say",
  run: async (client, msg, args) => {
    let say = args.join(" ");
    const imagesSend = msg.attachments.first()
    console.log(imagesSend)
    
    if(imagesSend) {
       await msg.delete()
       return msg.channel.send({ content: imagesSend.url})
    
    }
    
    else if (!say) {
      await msg.channel.send("Example: <prefix>.say test");
      return msg.delete(); // Menghapus pesan pengguna jika tidak ada teks
    }
      
      

    if (say.length > 250) {
      await msg.channel.send("The maximum character was 250")
      return msg.delete(); // Menghapus pesan pengguna jika teks melebihi 250 karakter
    }

    say = say.replace("@everyone", "@everyone").replace("@here", "@here").replace("ilham", "lu kontol "+msg.member.user.username)

    await msg.channel.send(say);
    msg.delete(); // Menghapus pesan pengguna setelah bot mengirimkan pesan
  }
};
# Discord Bot Project

## 🎉 Overview

**Discord Bot Project** adalah bot Discord yang dirancang untuk memberikan berbagai fitur menarik, seperti manajemen server, permainan interaktif, leveling sistem, dan banyak lagi! Bot ini dikembangkan menggunakan **Node.js** dengan library **Discord.js v13** untuk memberikan pengalaman terbaik bagi pengguna.

---

## 🎯 Features

1. **Utility and Management**

   - **AFK Notification**: Mengaktifkan status _Away From Keyboard_ (AFK) dengan pemberitahuan otomatis saat user disebutkan.
   - **Backup Server**: Menyimpan cadangan konfigurasi server Anda.
   - **Clear Messages**: Membersihkan pesan dalam jumlah besar di channel.
   - **Role Management**: Mendukung custom role untuk _Server Booster_ dengan opsi membuat, mengedit, dan membagikannya ke pengguna lain.
   - **Reminder System**: Menyediakan pengingat berbasis waktu untuk user melalui DM atau channel tertentu.
   - **Audit Log**: Melacak aktivitas penting di server untuk keperluan administrasi.

2. **Moderation Tools**

   - **Ban and Kick**: Memungkinkan admin untuk melarang atau mengeluarkan user dari server.
   - **Blacklist**: Memblokir user atau kata tertentu untuk menjaga lingkungan server tetap aman.
   - **Automoderation**: Memblokir kata kotor, spam mention, dan konten yang tidak diinginkan secara otomatis.

3. **Fun and Interactive**

   - **GIF Commands**: Berbagai perintah seperti `slap`, `hug`, `cuddle`, dan `kiss` untuk berbagi GIF anime dengan user lain.
   - **Confession System**: Mengirimkan pesan anonim ke channel tertentu.
   - **Search and Discovery**: Mendukung pencarian aplikasi, game, video YouTube, gambar Pinterest, dan lainnya.
   - **Giveaway**: Fitur undian interaktif untuk melibatkan komunitas.

4. **Information and Tools**

   - **User and Server Insights**: Menampilkan avatar, statistik server, dan informasi user secara mendetail.
   - **World Clock**: Melihat waktu di berbagai belahan dunia.
   - **NASA Picture of the Day**: Menampilkan foto luar angkasa dari NASA.
   - **Lyrics Search**: Mencari lirik lagu dengan cepat.
   - **Radio Streaming**: Mendukung pemutaran radio langsung di voice channel.

5. **Leveling and Leaderboard**

   - **Levelling System**: Memberikan XP dan level untuk aktivitas user dengan role sebagai hadiah.
   - **Leaderboard**: Menampilkan daftar pengguna dengan pesan, undangan, atau level terbanyak.

6. **Customization**

   - **Prefix Customization**: Mengubah prefix perintah sesuai preferensi server.
   - **Language Support**: Mengatur bahasa bot untuk pengalaman yang lebih personal.

7. **Advanced Integrations**

   - **LastFM Integration**: Melihat musik yang sedang Anda dengarkan, artis favorit, dan banyak lagi.
   - **AI Tools**: Menghasilkan gambar menggunakan teknologi AI.
   - **YouTube Integration**: Mengonversi video YouTube ke MP3 atau menampilkan statistik kanal.

8. **Others**
   - **Automatic Voice Channels**: Membuat dan mengatur voice channel secara otomatis.
   - **Ticketing System**: Membantu admin mengelola permintaan bantuan dari user.
   - **Anti-Crash System**: Menjamin stabilitas bot dengan mencegah crash akibat error.

---

## 💠 Diagrams

- **Class Diagram**: [Klik disini untuk melihat.](https://media.discordapp.net/attachments/909990115466682420/1330755600354644058/image.png?ex=678f223b&is=678dd0bb&hm=0b0c6ca598c4c047dbde38ddad4cae9460dc7b410b28ef1570ae23d4ac5a3124&=&format=webp&quality=lossless&width=477&height=463)
- **Sequence Diagram**: [Klik disini untuk melihat.](https://media.discordapp.net/attachments/909990115466682420/1330757700308701194/image.png?ex=678f2430&is=678dd2b0&hm=c0a2f4eb858bd1068e23efbc4cd2a25271a31297ee860009002732dbe8ceccd6&=&format=webp&quality=lossless)
- **Activity Diagram**: [Klik disini untuk melihat.](https://media.discordapp.net/attachments/909990115466682420/1330757826339143810/image.png?ex=678f244e&is=678dd2ce&hm=10370cbac4df241ad450119bef396d5946002572e3064e534a8dbacecba69ee9&=&format=webp&quality=lossless&width=315&height=463)
- **Use Case Diagram**: [Klik disini untuk melihat.](https://media.discordapp.net/attachments/909990115466682420/1330758104970952786/image.png?ex=678f2490&is=678dd310&hm=bb9cad0f6c5b4c6a9aa6d9e1f27cb462a841ece5becc2f1dd6c17ce1b91165f4&=&format=webp&quality=lossless&width=518&height=463)

---

## 🛠️ Technologies Used

- **Node.js**: Lingkungan runtime JavaScript.
- **Discord.js v13**: Library utama untuk interaksi dengan Discord API.
- **MongoDB**: Database untuk menyimpan data pengguna, leveling, dan konfigurasi server.
- **npm**: Untuk mengelola dependensi proyek.

---

## 📋 Prerequisites

Sebelum menjalankan proyek ini, pastikan Anda telah menginstal:

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **npm**: Sudah termasuk dalam instalasi Node.js.
- **MongoDB**: Untuk menyimpan data secara persisten.

---

## ⚙️ Installation

1. Clone repositori ini ke komputer Anda:

   ```bash
   git clone https://github.com/b1theaven/Discord-Bot.git
   cd your-repo-name

   ```

2. Instal dependensi yang diperlukan:

   ```bash
   npm install

   ```

3. Buat file `.env` untuk menyimpan token bot dan URI database:

   ```bash
   DISCORD_TOKEN=your-discord-bot-token
   MONGO_URI=your-mongodb-uri

   ```

4. Jalankan bot:
   ```bash
   node index.js
   ```

---

## 📜 Usage

1. Tambahkan bot ke server Anda:

- Gunakan link OAuth2 yang dihasilkan di [Discord Developer Portal](https://discord.com/developers/applications).

2. Gunakan perintah berikut:

- `a.help`: Melihat daftar perintah yang tersedia.
- `a.ping`: Mengecek latensi bot.
- `a.level`: Melihat level Anda di server.

3. Akses panel admin untuk konfigurasi tambahan (jika tersedia).

---

## 🤝 Contributing

Kami menyambut kontribusi dari siapa saja! Jika Anda memiliki ide atau menemukan bug:

1. Fork repositori ini.
2. Buat branch baru untuk perubahan Anda:
   ```bash
   git checkout -b feature-branch-name
   ```
3. Commit perubahan Anda:
   ```bash
   git commit -m "Add new feature/fix bug"
   ```
4. Push branch Anda:
   ```bash
   git push origin feature-branch-name
   ```
5. Buat Pull Request di GitHub.

---

## 🐛 Known Issues

- **Command timeout**: Beberapa perintah mungkin membutuhkan waktu lebih lama dari yang diharapkan. Kami sedang mengoptimalkan performa.
- **Compatibility**: Bot ini hanya mendukung Discord.js v13 ke atas.

## 📞 Support

Jika Anda memiliki pertanyaan atau memerlukan bantuan, hubungi kami melalui:

- Email: mohammadrizky881@gmail.com
- Discord: [Join Support Server](https://discord.gg/J4rBuvHskq)

---

## 📜 License

Proyek ini dilisensikan di bawah [MIT License](https://github.com/b1theaven/Discord-Bot/blob/main/LICENSE).

---

## 🎉 Acknowledgements

- **Discord.js**: Untuk library yang luar biasa.
- **MongoDB**: Untuk database yang andal.
- **Komunitas Discord**: Untuk inspirasi dan ide fitur.

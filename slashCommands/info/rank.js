const canvacord = require("canvacord");
const {
  MessageEmbed,
  MessageAttachment,
  MessageButton,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const adminId = "ADMIN_ID";
const humanize = require("humanize-duration");
const wait = require("node:timers/promises").setTimeout;
const level = require("../../models/level");
const cooldownTime = 29000 * 1000;
const cd = Date.now() + cooldownTime;
const cooldown = new Set();
const xpRandom = Math.floor(Math.random() * 1500) * 8;
const xpRandom2 = Math.floor(Math.random() * 170) * 6;
module.exports = {
  name: "rank",
  description: "Menunjukan rank card level",
  options: [
    {
      name: "user",
      type: "USER",
      description: "User to display",
      required: false,
    },
  ],
  execute: async (client, interaction, args) => {
    let msg = interaction;
    const user = interaction.options.getMember("user") || msg.member;
    console.log(user.user.roles);
    const data = await level.findOne({ guild: msg.guild.id, id: user.user.id });

    if (!data)
      return msg.reply({
        content: "Tidak dapat menemukan data level!",
        ephemeral: true,
      });
    const xpRequired = data.level * data.level * 100 + 100;
    const button = new MessageButton()
      .setCustomId("claim-xp")
      .setLabel("Claim xp gratis");
    if (cooldown.has(interaction.user.id)) {
      button.setEmoji("❌");
      button.setStyle("DANGER");
    } else {
      button.setEmoji("✅");
      button.setStyle("SUCCESS");
    }
    const button2 = new MessageButton()
      .setCustomId("xp-gratis")
      .setLabel("Mana xp gratis yang kau janjikan itu wo")
      .setStyle("SECONDARY")
      .setEmoji("🤫");
    if (cooldown.has(interaction.user.id)) {
      button2.setStyle("SUCCESS");
      button2.setEmoji("🗣️");
      button2.setLabel("Lu udah nge-claim xp gratis dari gue");
    }
    const mintaLevel = new MessageButton()
      .setLabel("Claim rank")
      .setEmoji("930999320247939112")
      .setCustomId("claimrank-btn")
      .setStyle("PRIMARY");
    const row = new MessageActionRow().addComponents(
      button,
      button2,
      mintaLevel
    );
    const rank = new canvacord.Rank()
      .setAvatar(user.user.displayAvatarURL({ format: "png", size: 512 }))
      .setCurrentXP(data.xp)
      .setRequiredXP(xpRequired)
      .setRank(1, "Rank", false)
      .setUsername(user.user.username)
      .setProgressBar("#DC143C", "COLOR")
      .setLevel(data.level, "Level")
      .setDiscriminator(user.user.tag);
    const rankCard = await rank.build();

    const attachment = new MessageAttachment(rankCard, "rankcard.png");

    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setImage("attachment://rankcard.png");

    if (user.user.id === interaction.user.id) {
      await interaction.deferReply();
      await wait(1000);
      const m = await msg.editReply({ files: [attachment], components: [row] });

      const filter = (i) => i.user.id === interaction.user.id;
      const collector = m.createMessageComponentCollector({
        componentType: "BUTTON",
        filter,
        time: 60 * 1000,
      });

      collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) {
          await i.reply({
            content: "Ni tombol bukan buat elu",
            ephemeral: true,
          });
        }
        if (i.customId === "claim-xp") {
          if (cooldown.has(interaction.user.id)) {
            return i
              .reply({
                content: `Rakus lu, lu kan udah ngeclaim xp gratis itu ga rispek banget ber. Lu harus nunggu **${humanize(
                  cd - Date.now()
                )}**`,
                ephemeral: true,
              })
              .catch((e) => {});
          }

          button.setStyle("DANGER");
          button.setEmoji("❌");
          button2.setEmoji("🗣️");
          button2.setStyle("SUCCESS");
          button2.setLabel("Lu udah nge-claim xp gratis dari gue");
          await interaction.editReply({ components: [row] });

          data.xp += xpRandom;
          data.save();
          await i
            .reply({
              content: `[xp-Gratis] Lu ngeclaim xp gratis sebanyak **+${xpRandom}**`,
              ephemeral: true,
            })
            .catch((e) => {});
          if (data.xp + xpRandom >= xpRequired) {
            const data2 = await level.findOne({
              guild: interaction.guild.id,
              id: user.user.id,
            });
            data2.level += 1;
            data2.xp = 0;
            await data2.save();
            await interaction
              .editReply({
                content: `**[LEVELUP]** Setelah ngeclaim xp gratis lu naik ke level **${data2.level}**`,
                ephemeral: true,
              })
              .catch((e) => {});
          }

          cooldown.add(interaction.user.id);
        }

        if (i.customId === "xp-gratis") {
          await i
            .reply({
              content: "Pencet disampingnya bodo kali kau",
              ephemeral: true,
            })
            .catch((e) => {});
        }
        if (i.customId === "claimrank-btn") {
          const levelData = await level.findOne({
            guild: msg.guild.id,
            id: user.user.id,
          });
          if (!levelData)
            return i
              .reply({
                content: "Tidak dapat menemukan data level",
                ephemeral: true,
              })
              .catch((e) => {});
          const select = new MessageSelectMenu()
            .setCustomId("claimrank")
            .setPlaceholder("Claim Rank")
            .addOptions([
              {
                label: "Kembali",
                emoji: "⏪",
                value: "kembali",
                description: "Kembali ke menu utama ( Button )",
              },
              {
                label: "Role @Active",
                description: "Claim rank jika Serval tidak memberikanmu role",
                emoji: "<:Level100:1275106987390144623>",
                value: "active",
              },
              {
                label: "Role @Very Active",
                description: "Claim rank jika Serval tidak memberikanmu role",
                emoji: "<:Level100:1275106987390144623>",
                value: "very-active",
              },
              {
                label: "Role @Hyperactive",
                description: "Claim rank jika Serval tidak memberikanmu role",
                emoji: "<:Level100:1275106987390144623>",
                value: "hyper-active",
              },
              {
                label: "Role @Super Active",
                description: "Claim rank jika Serval tidak memberikanmu role",
                emoji: "<:Level100:1275106987390144623>",
                value: "super-active",
              },
              {
                label: "Role @Super-Duper Active",
                description: "Claim rank jika Serval tidak memberikanmu role",
                emoji: "<:Level100:1275106987390144623>",
                value: "superduper-active",
              },
            ]);
          const selectRow = new MessageActionRow().addComponents(select);
          await i.update({ components: [selectRow] });
          const filterUser = (i) => i.user.id === interaction.user.id;
          const collector = interaction.channel.createMessageComponentCollector(
            { componentType: "SELECT_MENU", filter, time: 120 * 1000 }
          );

          collector.on("collect", async (i) => {
            const value = i.values[0];
            if (value === "active") {
              const dataLevel = await level.findOne({
                guild: msg.guild.id,
                id: user.user.id,
              });
              if (!dataLevel)
                return i
                  .reply({
                    content: "Tidak dapat menemukan data level",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              if (dataLevel.level < 10) {
                return i
                  .reply({
                    content:
                      "Levelmu kurang, dibutuhkan level `10` untuk menclaim role @Active",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              }
              if (user.roles.cache.has("ROLE_ID")) {
                return i
                  .reply({
                    content: "Kamu sudah memiliki role ini!",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              } else {
                user.roles.add("ROLE_ID");
                await i.update({ components: [row] });
                await i
                  .reply({
                    content: "Role berhasil ditambahkan",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              }
            }
            if (value === "very-active") {
              const dataLevel = await level.findOne({
                guild: msg.guild.id,
                id: user.user.id,
              });
              if (!dataLevel)
                return i
                  .reply({
                    content: "Tidak dapat menemukan data level",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              if (dataLevel.level < 20) {
                return i
                  .reply({
                    content:
                      "Levelmu kurang, dibutuhkan level `20` untuk menclaim role @Very Active",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              }
              if (user.roles.cache.has("ROLE_ID")) {
                return i
                  .reply({
                    content: "Kamu sudah memiliki role inI!",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              } else {
                user.roles.add("ROLE_ID");
                await i
                  .reply({
                    content: "Role berhasil ditambahkan",
                    ephemeral: true,
                  })
                  .catch((e) => {});
                await i.update({ components: [row] });
              }
            }
            if (value === "hyper-active") {
              const dataLevel = await level.findOne({
                guild: msg.guild.id,
                id: user.user.id,
              });
              if (!dataLevel)
                return i
                  .reply({
                    content: "Tidak dapat menemukan data level",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              if (dataLevel.level < 30) {
                return i
                  .reply({
                    content:
                      "Levelmu kurang, dibutuhkan level `30` untuk menclaim role @Hyperactive",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              }
              if (user.roles.cache.has("ROLE_ID")) {
                return i
                  .reply({
                    content: "Kamu sudah memiliki role ini!",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              } else {
                user.roles.add("ROLE_ID");
                await i.update({ components: [row] });
                await i
                  .reply({
                    content: "Role berhasil ditambahkan",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              }
            }
            if (value === "super-active") {
              const dataLevel = await level.findOne({
                guild: msg.guild.id,
                id: user.user.id,
              });
              if (!dataLevel)
                return i
                  .reply({
                    content: "Tidak dapat menemukan data level",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              if (dataLevel.level < 50) {
                return i
                  .reply({
                    content:
                      "Levelmu kurang, dibutuhkan level `50` untuk menclaim role @Super Active",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              }
              if (user.roles.cache.has("ROLE_ID")) {
                return i
                  .reply({
                    content: "Kamu sudah memiliki role in!",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              } else {
                user.roles.add("ROLE_ID");
                await i.update({ components: [row] });
                await i
                  .reply({
                    content: "Role berhasil ditambahkan",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              }
            }
            if (value === "superduper-active") {
              const dataLevel = await level.findOne({
                guild: msg.guild.id,
                id: user.user.id,
              });
              if (!dataLevel)
                return i
                  .reply({
                    content: "Tidak dapat menemukan data level",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              if (dataLevel.level < 75) {
                return i
                  .reply({
                    content:
                      "Levelmu kurang, dibutuhkan level `75` untuk menclaim role @Super-Duper Active",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              }
              if (user.roles.cache.has("ROLE_ID")) {
                return i
                  .reply({
                    content: "Kamu sudah memiliki role ini!",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              } else {
                user.roles.add("ROLE_ID");
                await i.update({ components: [row] });
                await i
                  .reply({
                    content: "Role berhasil ditambahkan",
                    ephemeral: true,
                  })
                  .catch((e) => {});
              }
            }
            if (value === "kembali") {
              await i.update({ components: [row] });
            }
          });
          collector.on("end", async (i) => {
            await interaction.editReply({ components: [] }).catch((e) => {});
          });
        }
      });

      setTimeout(() => {
        cooldown.delete(interaction.user.id);
      }, cooldownTime);

      collector.on("end", async (i) => {
        button.setDisabled(true);
        button2.setDisabled(true);
        mintaLevel.setDisabled(true);
        await interaction.editReply({ components: [row] });
      });
    } else {
      return interaction.reply({ files: [attachment] });
    }
  },
};

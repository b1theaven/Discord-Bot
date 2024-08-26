const blacklist = require("../../models/blacklist")


module.exports = {
    name: "blacklist",
    description: "Blacklist member",
    permission: "MODERATE_MEMBERS",
    options: [
        {
            name: "member",
            type: "USER",
            description: "Member yang mau diblacklist",
            required: true
        },
        {
            name: "choices",
            required: true,
            description: "Pilih mau di hapus atau diblacklist",
            type: "STRING",
            choices: [
                {
                    name: "blacklist",
                    value: "blacklist-member"
                },
                {
                    name: "hapus",
                    value: "hapus-blacklist"
                }
            ]
        }
    ],
    execute: async (client, interaction, args) => {
        const member = interaction.options.getUser("member")
        const value = interaction.options.get("choices").value
        if(value === "blacklist-member") {
            blacklist.findOne({ id: member.id }, async(err, data) => {
                if(data) {
                    if(data.id.includes(member.id)) return interaction.reply({ content: "Member ini sudah diblacklist", ephemeral: true})
                } else {
                    data = new blacklist({ id: member.id })
                }
                await data.save()
                return interaction.reply({ content: `${member.displayName} berhasil diblacklist!`})
            })
            
        } else if(value === "hapus-blacklist") {
            blacklist.findOne({ id: member.id }, async (err, data) => {
            if(data) {
                if(data.id.includes(member.id)) {
                    for(let i = 0; i < data.id.length; i++) {
                        if(data.id[i] === member.id) data.id.splice(i, 1)
                    }
                    await data.save()
                    await interaction.reply({ content: `${member.displayName} sudah dihapus dari blacklist`})
                } else return interaction.reply({ content: "Tidak bisa dihapus", ephemeral: true})
            }
         })
        }
 }
}
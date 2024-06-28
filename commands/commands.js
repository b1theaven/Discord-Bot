const schema = require("../models/commands")
const { ownerID } = require("../config.json")
const {stripIndents} = require("common-tags")
const prefixSchema = require('../models/prefix')
module.exports = {
    name: "commands",
    ownerOnly: true,
    run: async (client, msg, args) => {
        let prefix;
        const dataPrefix = await prefixSchema.findOne({ guild: msg.guild.id})
        if(dataPrefix === null) {
          prefix = '.'
        } else {
          prefix = dataPrefix.prefix
        }
        if(!ownerID.includes(msg.author.id)) return;
        if(!args[0]) return msg.channel.send({ content: stripIndents`
\`\`\`a
Choose..

${prefix}command disable <command_name>\n${prefix}command enable <command_name>
\`\`\`` })
        if(args[0] === "disable") {
            if(!args[1]) return msg.channel.send({ content: stripIndents`
\`\`\`a
Please specify commands
\`\`\`` })
            const cmd = args[1]
            if(client.commands.get(cmd) === undefined) return msg.channel.send({ content: stripIndents`
\`\`\`a
Oppss..

I can't find this commands
\`\`\`` })
        schema.findOne({ Cmds: cmd }, async(err, data) => {
            if(data) {
                if(data.Cmds.includes(cmd)) return msg.channel.send({ content: stripIndents`
\`\`\`a
Oppss..

This commands already disabled
\`\`\`` })
                data.Cmds.push(cmd)
                
            } else {
                data = new schema({
                    Cmds: cmd
                })
            }
            await data.save()
            msg.channel.send({ content: stripIndents`
\`\`\`a
Success..

Disabled commands ${cmd}
\`\`\`` })
        })
        } else if(args[0] === "enable") {
            if(!args[1]) return msg.channel.send({ content: stripIndents`
\`\`\`a
Oppss.

Please specify commands
\`\`\`` })
            const cmd = args[1]
            if(client.commands.get(cmd) === undefined) return msg.channel.send({ content: stripIndents`
\`\`\`a
Something Wrong..

I can't find this commands
\`\`\`` })
            schema.findOne({ Cmds: cmd}, async(err, data) => {
                if(err) throw err;
                if(data) {
                    if(data.Cmds.includes(cmd)) {
                        for(let i = 0; i < data.Cmds.length; i++) {
                            if(data.Cmds[i] === cmd) data.Cmds.splice(i, 1)
                        }
                        await data.save()
                        msg.channel.send({ content: stripIndents`
\`\`\`a
Success..

Enabled commands ${cmd}   
\`\`\`` })
                    } else return msg.channel.send({ content: stripIndents`
\`\`\`a
Oppss..

Commands is'nt turned off
\`\`\`` })
                }
            })
        }
    }
}
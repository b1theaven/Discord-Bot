const { slashCommandBuilder, PermissionsBitField, MessageEmbed } = require('discord.js')
const {stripIndents} = require('common-tags')
module.exports = {
  name: "automod-flaggedword",
  description: "Block profanity and sexual content.",
  permission: "ADMINISTRATOR",
  options: [
    {
      name: 'channel',
      description: 'Mention any channel',
      type: "CHANNEL",
      required: true
    },
    {
      name: "action",
      description: 'An action',
      type: "NUMBER",
      required: true,
      choices: [
        {
        name: "1 | Blocks a member's message",
        value: 1
        
      },
        {
          name: "2 | Send alert",
          value: 2
        },
        {
          name: "3 | Timeout user",
          value: 3
        }
        ]
    },
        {
      name: 'duration',
      description: 'Set duration timeout ( 1 minutes is the default)',
      type: "NUMBER",
      required: true,
      choices: [
        {
          name: '10 minutes',
          value: 600
        },
        {
          name: '1 hours',
          value: 3600
        },
        {
          name: '2 hours',
          value: 18000
        },
        {
          name: '5 days',
          value: 18000
        },
        {
          name: '1 weeks',
          value: 604800
        },
        {
          name: '2 weeks',
          value: 1209600
        },
        {
          name: '3 weeks',
          value: 1814400
        },
        {
          name: '4 weeks',
          value: 2419200
        }
        ]
        }
    ],
  execute: async(client, interaction, args) => {
    const action = options.get('action').value
    const channelid = options.getChannel('channel')
    const time = options.get('duration').value
    const actiontype = options.get('action').value
    if(channelid.type === "GUILD_VOICE") return interaction.channel.send({ content:"Please provide a valid text channel" });
    if(channelid.type === "GUILD_CATEGORY") return interaction.channel.send({ content:"Please provide a valid text channel" });
    
    const { guild, options } = interaction
    
    //if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You do not have a permission to setup automod within thi server', ephemeral: true})
        await interaction.reply({ content: 'Please wait for the automod rules on this server...' })
        
        const a = await guild.autoModerationRules.create({
          name: 'Block profanity and sexual content.',
          creatorId: '864026043378565160',
          enabled: true,
          eventType: 1,
          triggerType: 4,
          triggerMetadata:
          {
            presets: [1, 2, 3]
          },
          actions: [{
            type: 1,
            metadata: {
              channel: interaction.channel,
              channelId: interaction.channel.id,
              durationSeconds: time || 60,
              customMessage: 'This message was prevented by SKIPPER.'
            }
          }]
        }).catch(async err =>{
          setTimeout(async () =>{
            console.log(err)
            await interaction.editReply({ content: err.message })
          }, 5000)
        })
        setTimeout(async () => {
          
          if(!a) return
           const embed = new MessageEmbed()
          .setColor('GREEN')
          .setDescription(stripIndents`
          <:emoji_6:873274347249348669> You automod rule has been created.
          ---------------------------------------------
          > Server: ${interaction.guild.name}
          > Channel: ${interaction.channel.name}
          > Duration timeout: ${msToTime(time)} ( 1 minutes is the default )
          > Action type: ${actiontype} 
          ---------------------------------------------
          All swears words will be stopped. Thank you`)
          .setFooter('To delete the automod system type /automod-delete [BETA].')
          
          await interaction.editReply({ embeds: [embed]})
          
        }, 5000)
  }
}

function msToTime(ms) {
  let seconds = (ms / 1).toFixed(1);
  let minutes = (ms / (1 * 60)).toFixed(1);
  let hours = (ms / (1 * 60 * 60)).toFixed(1);
  let days = (ms / (1 * 60 * 60 * 24)).toFixed(1);
  let weeks = (ms / (1 * 60 * 60 * 168)).toFixed(1);
  if (seconds < 60) return seconds + " Sec";
  else if (minutes < 60) return minutes + " Min";
  else if (hours < 24) return hours + " Hrs";
  else if (weeks < 168 ) return weeks + " Weeks";
  else return days + " Days"
  //else return weeks + " Weeks"
}
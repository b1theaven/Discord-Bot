const Discord = require('discord.js')
const { stripIndents } = require('common-tags')
const lang = require('../language')
module.exports = {
    name: "permissions",
    cooldown: 5,
    run: async(client, message, args) => {


    const mem = args.join(' ');
    
          (async () => {
            let infoMem;
            const server = message.guild;

            if (!mem) {
              infoMem = message.member;
            } else {
              infoMem = message.mentions.members.first() || server.members.cache.find(m => m.id === `${mem}`) || server.members.cache.find(m => m.displayName.toUpperCase() === `${mem.toUpperCase()}`) || server.members.cache.find(m => m.user.username.toUpperCase() === `${mem.toUpperCase()}`) || server.members.cache.find(m => m.user.username.toLowerCase()
                .includes(`${mem.toLowerCase()}`));
            }
            if (!infoMem) {
              return message.channel.send({ content: lang(message.guild, "CANNOT_FIND_USER") });
            }

            
            const yes = '<:emoji_6:873274347249348669>';
            const no = '<:emoji_7:873274370640998460>';

            if (infoMem.permissions.has('ADMINISTRATOR')) {
              const embed = new Discord.MessageEmbed();
              embed.setColor('#2BFED5');
              embed.setAuthor(infoMem.displayName, infoMem.user.displayAvatarURL());
              embed.setFooter(`Requested by: ${message.member.displayName}`);
              embed.setTimestamp();

    
              embed.addField('➢ __General Permissions:__', stripIndents`
  \`Administrator\`| ${yes}
  `, true);

              return message.channel.send({ embeds: [embed]});
            }
            const embed = new Discord.MessageEmbed();
            embed.setColor('#2BFED5');
            embed.setAuthor(infoMem.displayName, infoMem.user.displayAvatarURL());
            embed.setFooter(`Requested by: ${message.member.displayName}`);
            embed.setTimestamp();

            embed.addField('➢ __General Permissions:__', stripIndents`
  \`Administrator\`| ${no}
  \`View Audit Logs\`| ${(infoMem.permissions.has('VIEW_AUDIT_LOG') ? yes : no)}
  \`Manage Server\`| ${(infoMem.permissions.has('MANAGE_GUILD') ? yes : no)}
  \`Manage Roles\`| ${(infoMem.permissions.has('MANAGE_ROLES') ? yes : no)}
  \`Manage Channels\`| ${(infoMem.permissions.has('MANAGE_CHANNELS') ? yes : no)}
  \`Kick Members\`| ${(infoMem.permissions.has('KICK_MEMBERS') ? yes : no)}
  \`Ban Members\`| ${(infoMem.permissions.has('BAN_MEMBERS') ? yes : no)}
  \`Create Invite\`| ${(infoMem.permissions.has('CREATE_INSTANT_INVITE') ? yes : no)}
  \`Change Nickname\`| ${(infoMem.permissions.has('CHANGE_NICKNAME') ? yes : no)}
  \`Manage Nicknames\`| ${(infoMem.permissions.has('MANAGE_NICKNAMES') ? yes : no)}
  \`Manage Webhooks\`| ${(infoMem.permissions.has('MANAGE_WEBHOOKS') ? yes : no)}
  \`View Guild Insights\`| ${infoMem.permissions.has('VIEW_GUILD_INSIGHTS') ? yes : no}
  `, true);

            embed.addField('➢ __Text Permissions:__', stripIndents`
  \`Send Messages\`| ${(infoMem.permissions.has('SEND_MESSAGES') ? yes : no)}
  \`Send TTS Messages\`| ${(infoMem.permissions.has('SEND_TTS_MESSAGES') ? yes : no)}
  \`Manage Messages\`| ${(infoMem.permissions.has('MANAGE_MESSAGES') ? yes : no)}
  \`Embed Links\`| ${(infoMem.permissions.has('EMBED_LINKS') ? yes : no)}
  \`Attach Files\`| ${(infoMem.permissions.has('ATTACH_FILES') ? yes : no)}
  \`Read Message History\`| ${(infoMem.permissions.has('READ_MESSAGE_HISTORY') ? yes : no)}
  \`Mention Everyone\`| ${(infoMem.permissions.has('MENTION_EVERYONE') ? yes : no)}
  \`Use External Emojis\`| ${(infoMem.permissions.has('USE_EXTERNAL_EMOJIS') ? yes : no)}
  \`Add Reactions\`| ${(infoMem.permissions.has('ADD_REACTIONS') ? yes : no)}
  `, true);

            embed.addField('➢ __Voice Permissions:__', stripIndents`
  \`Connect\`| ${(infoMem.permissions.has('CONNECT') ? yes : no)}
  \`Speak\`| ${(infoMem.permissions.has('SPEAK') ? yes : no)}
  \`Mute Members\`| ${(infoMem.permissions.has('MUTE_MEMBERS') ? yes : no)}
  \`Deafen Members\`| ${(infoMem.permissions.has('DEAFEN_MEMBERS') ? yes : no)}
  \`Move Members\`| ${(infoMem.permissions.has('MOVE_MEMBERS') ? yes : no)}
  \`Use Voice Activity\`| ${(infoMem.permissions.has('USE_VAD') ? yes : no)}
  \`Priority Speaker\`| ${(infoMem.permissions.has('PRIORITY_SPEAKER') ? yes : no)}
  `, true);

            return message.channel.send({ embeds: [embed] });
          })()
        }
      }
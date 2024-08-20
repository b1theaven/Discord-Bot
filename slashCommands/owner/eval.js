const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const choice = ["🚫"];
const {stripIndents} = require("common-tags")
const wait = require("node:timers/promises").setTimeout
module.exports = {
 name:"eval",
 description: "Evaled some code",
 options: [{
   name: "code",
   type: "STRING",
   description: "Evaled some code",
   required: true
 }],
 ownerOnly: true,
 execute: async (client, interaction, args) => {
   const deleteButton = new MessageButton()
   .setCustomId("delete")
   .setLabel("Delete")
   .setStyle("DANGER")
   
   const row = new MessageActionRow()
   .addComponents(
     deleteButton
     )
   const filter = i => i.customId === "delete" && i.user.id === msg.user.id
  const bot = client;
  const msg = interaction;
  const ytdl = require("ytdl-core")
  
  const { flags } = parseQuery(args);
  try {
    //if(!ownerID.includes(interaction.author.id)) return;
    
    //if (!args.length) {
      //return;
    //}
    let [ code ] = args;
    let depth = 0;
    if (flags.includes("async")) {
      code = `(async() => { ${code} })()`;
    }
    if (flags.some(x => x.includes("depth"))) {
      depth = flags.find(x => x.includes("depth")).split("=")[1];
      depth = parseInt(depth, 10);
    }
    let { evaled, type } = await parseEval(eval(code)); /* eslint-disable-line */
    if (flags.includes("silent")) return;
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled, { depth });
    evaled = evaled
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`);
    if (evaled.length > 2048) evaled = await client.hastebin(evaled);
    else evaled = `${evaled}`;
    const embed = new MessageEmbed()
      .setAuthor("Evaled success")
      .setColor("BLACK")
      .setDescription(stripIndents`
      \`\`\`js
      ${evaled}
      \`\`\``)
      .addField("Type", stripIndents`
      \`\`\`js
      ${type}
      \`\`\``)
      .setFooter(`Evaled`);
    await interaction.deferReply()
    await wait(1000)
    await interaction.editReply({ embeds: [embed], components: [row] }).then(async (m) => {
      const collector = m.createMessageComponentCollector({ componentType: 'BUTTON', time: 60 * 1000})
      collector.on("collect", async (i) => {
        if(i.user.id === msg.user.id) {
          if(i.customId === "delete") {
            m.delete()
          }
        } else {
          i.deferUpdate()
        }
      })
    })
  } catch (e) {
    const embed = new MessageEmbed()
      .setColor("RED")
      .setAuthor("Evaled error")
      .setDescription(`\`\`\`${e}\`\`\``)
      .setFooter(`Evaled`);
    await interaction.deferReply()
    await wait(1000)
    await interaction.editReply({ embeds: [embed], components: [row] }).then(m => {
      const collector = m.createMessageComponentCollector({ componentType: "BUTTON", time: 60 * 1000})
      collector.on("collect", async (i) => {
        if(i.user.id === msg.user.id) {
          if(i.customId === "delete") {
            m.delete()
          }
        } else {
          i.deferUpdate()
        }
      })
    })
  }
}
}

async function parseEval(input) {
  const isPromise =
    input instanceof Promise &&
    typeof input.then === "function" &&
    typeof input.catch === "function";
  if (isPromise) {
    input = await input;
    return {
      evaled: input,
      type: `Promise<${parseType(input)}>`
    };
  }
  return {
    evaled: input,
    type: parseType(input)
  };
}

function parseType(input) {
  if (input instanceof Buffer) {
    let length = Math.round(input.length / 1024 / 1024);
    let ic = "MB";
    if (!length) {
      length = Math.round(input.length / 1024);
      ic = "KB";
    }
    if (!length) {
      length = Math.round(input.length);
      ic = "Bytes";
    }
    return `Buffer (${length} ${ic})`;
  }
  return input === null || input === undefined ? "Void" : input.constructor.name;
}

function parseQuery(queries) {
  const args = [];
  const flags = [];
  for (const query of queries) {
    if (query.startsWith("--")) flags.push(query.slice(2).toLowerCase());
    else args.push(query);
  }
  return { args, flags };
}
MessageEmbed
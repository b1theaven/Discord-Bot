const Discord = require("discord.js");
const choice = ["🚫"]
const { exec } = require('child_process');
module.exports = { 
  name: "execute", 
  aliases: ["exec"],
  ownerOnly: true,
  run: async (client, message, args) => {

        const code = args.join(' ');
		if (!code) return
		exec(code, (error, stdout, stderr) => {
			const input = `\`\`\`Bash\n${code}\n\`\`\``;
			if (error) {
				let output = `\`\`\`Bash\n${error}\n\`\`\``;
				const embed = new Discord.MessageEmbed()
					.setTitle('Executed Error')
					.addField('Input', input)
					.addField('Error', output)
					.setColor("GREEN")
        .setFooter("Execute")
			   return message.channel.send({ embeds: [embed]})
			} else {
				const output = stderr || stdout;
				const output2 = `\`\`\`Bash\n${output}\n\`\`\``;
				const embed = new Discord.MessageEmbed()
					.setTitle('Executed Success')
					.addField('Input', input)
					.addField('Output', messageLimit(output2))
					.setColor("GREEN")
          .setFooter("Execute")
				return message.channel.send({ embeds: [embed]})
      }
    })
}
}

function messageLimit(str) {
  if (str.length > 1000) {
      return str.substring(0, 1001) + '...';
  } else {
      return str;
  }
}
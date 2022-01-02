const {
    MessageEmbed,
    CommandInteraction,
    Client
} = require("discord.js");

module.exports = {
    name: "help",
    description: "Displays a list of all current commands",
    type: 'CHAT_INPUT',

    run: async (client, interaction) => {
       const embed = new MessageEmbed()
            .setTitle(`${client.user.username}'s commands`)
            .addField('Config command', '\`setmodlogs\`')
            .addField('Mod commands', '\`addrole\`, \`ban\`, \`clear\`, \`kick\`, \`lock\`, \`nickname\`, \`removerole\`, \`slowmode\`, \`timeout\`, \`unban\`, \`unlock\`, \`unwarn\`, \`warn\`, \`warnings\`')
            .addField('Info commands', '\`help\`, \`ping\`, \`userinfo\`')
            .addField('Bot name', `\`${client.user.username}\``, true)
            .addField('Discriminator', `\`#${client.user.discriminator}\``, true)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter(`${interaction.member.user.username}`, interaction.member.user.displayAvatarURL({
                dynamic: true
            }))
            .setColor(interaction.guild.me.displayHexColor)
            .setTimestamp()

        await interaction.followUp({
            embeds: [embed]
        })
    },
};
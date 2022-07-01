const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { modLog, randomHex } = require("../../handler/functions");
const { fail } = require("../../config.json");

module.exports = {
    name: "slowmode",
    description: "slowmode command",
    options: [
        {
            name: "rate",
            description: "rate limit between 1 and 21600",
            type: "INTEGER",
            required: true,
        },
        {
            name: "channel",
            description:
                "enables slowmode in a channel with the specified rate",
            type: "CHANNEL",
            required: false,
        },
        {
            name: "reason",
            description: "reason for this slowmode",
            type: "STRING",
            required: false,
        },
    ],

    run: async (client, interaction) => {
        const rate = interaction.options.getInteger("rate");
        const channel =
            interaction.options.getChannel("channel") || interaction.channel;
        const reason =
            interaction.options.getString("reason") || "`No Reason Provided`";

        if (rate <= 0 || rate > "21600")
            return interaction.followUp({
                content: `${fail} You need to put a number between 1 and 21600`,
            });

        if (!channel.isText()) {
            return interaction.followUp({
                content: `${fail} Please select a text channel `,
            });
        }

        await channel.setRateLimitPerUser(rate, reason);

        const embed = new MessageEmbed()
            .setTitle("Slowmode")
            .setFooter(
                `${interaction.client.user.tag}`,
                `${interaction.client.user.displayAvatarURL()}`
            )
            .setTimestamp()
            .setColor(randomHex());

        interaction.followUp({
            embeds: [
                embed
                    .addField("Moderator", `\`${interaction.user.tag}\``, true)
                    .addField("Channel", `${channel}`, true)
                    .addField("Rate", `\`${rate}\``, true)
                    .addField("Reason", `${reason}`),
            ],
        });

        modLog(interaction, reason, {
            Action: "`Slowmode`",
            Channel: `${channel}`,
            Rate: `${rate}`,
        });
    },
};

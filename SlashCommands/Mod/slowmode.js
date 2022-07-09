const { MessageEmbed } = require("discord.js");
const { modLog, randomHex } = require("../../handler/functions");
const { fail } = require("../../config.json");
const ms = require("ms");

module.exports = {
    name: "slowmode",
    description: "slowmode command",
    category: "mod",
    options: [
        {
            name: "rate",
            description: "rate limit between 1 and 21600",
            type: "INTEGER",
            required: true,
            choices: [
                { name: "off", value: 0 },
                { name: "5 seconds", value: 5 },
                { name: "10 seconds", value: 10 },
                { name: "15 seconds", value: 15 },
                { name: "30 seconds", value: 30 },
                { name: "1 minute", value: 60 },
                { name: "2 minutes", value: 120 },
                { name: "5 minutes", value: 300 },
                { name: "10 minutes", value: 600 },
                { name: "15 minutes", value: 900 },
                { name: "30 minutes", value: 1800 },
                { name: "1 hour", value: 3600 },
                { name: "2 hours", value: 7200 },
                { name: "6 hours", value: 21600 },
            ],
        },
        {
            name: "channel",
            description:
                "enables slowmode in a channel with the specified rate",
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"],
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
        channel =
            interaction.options.getChannel("channel") || interaction.channel;
        reason =
            interaction.options.getString("reason") || "`No Reason Provided`";

        if (rate === 0 && !channel.rateLimitPerUser)
            return interaction.followUp({
                content: `${fail} Slowmode is already off`,
            });

        await channel.setRateLimitPerUser(rate, reason);

        const embed = new MessageEmbed()
            .setTitle("Slowmode")
            .setFooter({
                text: client.user.tag,
                iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp()
            .setColor(randomHex());

        interaction.followUp({
            embeds: [
                embed
                    .addField("Moderator", `\`${interaction.user.tag}\``, true)
                    .addField("Channel", `${channel}`, true)
                    .addField(
                        "Rate",
                        rate > 0
                            ? `\`${ms(rate * 1e3, { long: true })}\``
                            : "`off`",
                        true
                    )
                    .addField("Reason", `${reason}`),
            ],
        });

        modLog(interaction, reason, {
            Action: "`Slowmode`",
            Channel: `${channel}`,
            Rate: rate > 0 ? `\`${ms(rate * 1e3, { long: true })}\`` : "`off`",
        });
    },
};

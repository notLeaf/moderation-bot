const { MessageEmbed } = require("discord.js");
const {
    confirmButtons,
    modLog,
    randomHex,
} = require("../../handler/functions");
const { fail, success } = require("../../config.json");
const ms = require("ms");

module.exports = {
    name: "timeout",
    description: "time someone out",
    category: "mod",
    options: [
        {
            name: "target",
            description: "target to timeout",
            type: "USER",
            required: true,
        },
        {
            name: "time",
            description: "amount of time to timeout",
            type: "INTEGER",
            required: true,
            minValue: 1,
            maxValue: 60,
        },
        {
            name: "unit",
            description: "time unit",
            type: "STRING",
            required: true,
            choices: [
                { name: "seconds", value: "s" },
                { name: "minutes", value: "m" },
                { name: "hours", value: "h" },
                { name: "days", value: "d" },
            ],
        },
        {
            name: "reason",
            description: "reason for this timeout",
            type: "STRING",
            required: false,
        },
    ],

    run: async (client, interaction) => {
        let target = interaction.options.getMember("target");
        reason =
            interaction.options.getString("reason") || "`No Reason Provided`";
        time = ms(
            interaction.options.getInteger("time") +
                interaction.options.getString("unit")
        );

        time > 2332800000 ? (time = 2332800000) : (time = time);

        if (target.id === interaction.member.id)
            return interaction.editReply({
                content: `${fail} You cant timeout yourself`,
            });

        if (target.id === interaction.guild.me.id)
            return interaction.editReply({
                content: `${fail} You cant timeout me`,
            });

        if (target.id === interaction.guild.ownerId)
            return interaction.followUp({
                content: `${fail} You cannot mute the server owner`,
            });

        if (
            target.roles.highest.position >=
            interaction.member.roles.highest.position
        )
            return interaction.editReply({
                content: `${fail} This user is higher/equal than you`,
            });

        if (
            target.roles.highest.position >=
            interaction.guild.me.roles.highest.position
        )
            return interaction.editReply({
                content: `${fail} This user is higher/equal than me`,
            });

        if (!target.moderatable)
            return interaction.editReply({
                content: `${fail} This user can't be timed out`,
            });

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({
                    dynamic: true,
                }),
            })
            .setDescription(
                `**${interaction.user.tag}** are you sure you want to timeout **${target.user.tag}**`
            )
            .setFooter({
                text: client.user.tag,
                iconURL: client.user.displayAvatarURL(),
            })
            .setColor(randomHex())
            .setTimestamp();

        confirmButtons(interaction, {
            embed: embed,
            authorOnly: `Only <@${interaction.member.id}> can use these buttons`,
            yes: {
                style: "SUCCESS",
                label: "Timeout",
                emoji: "✔️",
            },
            no: {
                style: "SECONDARY",
                label: "No",
                emoji: "🛑",
            },
        }).then(async (confirm) => {
            if (confirm === "yes") {
                await target.timeout(time, reason);
                interaction.editReply({
                    content: `${success} **${
                        target.user.tag
                    }** has been timed out for **${ms(time, { long: true })}**`,
                });
                modLog(interaction, reason, {
                    Action: "`Timeout`",
                    Member: `${target}`,
                    Time: `\`${ms(time, { long: true })}\``,
                });
            }
            if (confirm === "no") {
                interaction.editReply({
                    content: `${fail} **${target.user.tag}** hasn't been timed out!`,
                });
            }
            if (confirm === "time") {
                interaction.editReply({
                    content: `${fail} Time is up`,
                });
            }
        });
    },
};

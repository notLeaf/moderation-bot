const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const {
    confirmButtons,
    modLog,
    randomHex,
} = require("../../handler/functions");
const { fail, success } = require("../../config.json");
const warnModel = require("../../models/warnModel");

module.exports = {
    name: "warn",
    description: "warns a member in your server",
    userPermissions: ["KICK_MEMBERS"],
    clientPermissions: ["KICK_MEMBERS"],
    options: [
        {
            name: "target",
            description: "target to warn",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "reason for this warn",
            type: "STRING",
            required: false,
        },
    ],

    run: async (client, interaction) => {
        const target = interaction.options.getMember("target");
        const reason =
            interaction.options.getString("reason") || "`No Reason Provided`";

        if (target.id === interaction.member.id)
            return interaction.followUp({
                content: `${fail} You cant warn yourself`,
            });

        if (target.id === interaction.guild.me.id)
            return interaction.followUp({
                content: `${fail} You cant warn me`,
            });

        if (target.id === interaction.guild.ownerId)
            return interaction.followUp({
                content: `${fail} You cannot warn the server owner`,
            });

        if (
            target.roles.highest.position >=
            interaction.member.roles.highest.position
        )
            return interaction.followUp({
                content: `${fail} This user is higher/equal than you`,
            });

        if (
            target.roles.highest.position >=
            interaction.guild.me.roles.highest.position
        )
            return interaction.followUp({
                content: `${fail} This user is higher/equal than me`,
            });

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({
                    dynamic: true,
                }),
            })
            .setDescription(
                `**${interaction.user.tag}** are you sure you want to warn **${target.user.tag}**`
            )
            .setFooter(client.user.tag, client.user.displayAvatarURL())
            .setColor(randomHex())
            .setTimestamp();

        confirmButtons(interaction, {
            embed: embed,
            authorOnly: `Only <@${interaction.member.id}> can use these buttons`,
            yes: {
                style: "PRIMARY",
                label: "Warn",
                emoji: "✔️",
            },
            no: {
                style: "SECONDARY",
                label: "No",
                emoji: "🛑",
            },
        }).then(async (confirm) => {
            if (confirm === "yes") {
                await new warnModel({
                    userId: target.id,
                    guildId: interaction.guildId,
                    moderatorId: interaction.user.id,
                    reason,
                    timestamp: Date.now(),
                }).save();
                interaction.editReply({
                    content: `${success} Warned **${target.user.tag}** successfully!`,
                });
                modLog(interaction, reason, {
                    Action: "`Warn`",
                    Member: `${target}`,
                });
            }
            if (confirm === "no") {
                interaction.editReply({
                    content: `${fail} **${target.user.tag}** hasn't been warned!`,
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

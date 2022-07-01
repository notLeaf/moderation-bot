const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const {
    confirmButtons,
    modLog,
    randomHex,
} = require("../../handler/functions");
const { fail, success } = require("../../config.json");
const warnModel = require("../../models/warnModel");

module.exports = {
    name: "unwarn",
    description: "unwarns a member in your server",
    options: [
        {
            name: "warnid",
            description: "warnId you want to delete",
            type: "STRING",
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
        try {
            const warnId = interaction.options.getString("warnid");
            const data = await warnModel.findById(warnId);

            const user = interaction.guild.members.cache.get(data.userId);
            const reason =
                interaction.options.getString("reason") ||
                "`No Reason Provided`";

            const embed = new MessageEmbed()
                .setAuthor({
                    name: `${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({
                        dynamic: true,
                    }),
                })
                .setDescription(
                    `**${interaction.user.tag}** are you sure you want to unwarn ${user}`
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
                    style: "PRIMARY",
                    label: "Unwarn",
                    emoji: "✔️",
                },
                no: {
                    style: "SECONDARY",
                    label: "Cancel",
                    emoji: "🛑",
                },
            }).then(async (confirm) => {
                if (confirm === "yes") {
                    await data.delete();
                    interaction.editReply({
                        content: `${success} Unwarned **${user}** successfully!`,
                    });
                    modLog(interaction, reason, {
                        Action: "`Unwarn`",
                        Member: `${user}`,
                    });
                }
                if (confirm === "no") {
                    interaction.editReply({
                        content: `${fail} cancelled!`,
                    });
                }
                if (confirm === "time") {
                    interaction.editReply({
                        content: `${fail} Time is up`,
                    });
                }
            });
        } catch (e) {
            return interaction.followUp({
                content: `${fail} This is not a valid warnID`,
            });
        }
    },
};

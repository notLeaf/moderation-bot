const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const {
    confirmButtons,
    modLog,
    randomHex,
} = require("../../handler/functions");
const { fail, success } = require("../../config.json");

module.exports = {
    name: "nickname",
    description: "changes the provided user's nickname to the one specified",
    options: [
        {
            name: "target",
            description: "target you want to change the nickname",
            type: "USER",
            required: true,
        },
        {
            name: "nick",
            description: "new nickname",
            type: "STRING",
            required: true,
        },
        {
            name: "reason",
            description: "reason for this action",
            type: "STRING",
            required: false,
        },
    ],

    run: async (client, interaction) => {
        const target = interaction.options.getMember("target");
        newnick = interaction.options.getString("nick");
        reason =
            interaction.options.getString("reason") || "`No Reason Provided`";

        if (target.id === interaction.guild.me.id)
            return interaction.followUp({
                content: `${fail} You cant change my name`,
            });

        if (target.id === interaction.guild.ownerId)
            return interaction.followUp({
                content: `${fail} You cannot modify the server owner`,
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

        if (newnick.length > 32)
            return interaction.followUp({
                content: `${fail} Please ensure the nickname is no larger than 32 characters`,
            });

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({
                    dynamic: true,
                }),
            })
            .setDescription(
                `**${interaction.user.tag}** are you sure you want to change **${target.user.username}**'s nickname`
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
                label: "Yes",
                emoji: "✔️",
            },
            no: {
                style: "SECONDARY",
                label: "No",
                emoji: "🛑",
            },
        }).then(async (confirm) => {
            if (confirm === "yes") {
                await target.setNickname(newnick);
                interaction.editReply({
                    content: `${success} **${target.user.username}**'s nickname was successfully updated. **(${newnick})**`,
                });
                modLog(interaction, reason, {
                    Action: "`Nickname`",
                    Member: `${target}`,
                    Nickname: `\`${newnick}\``,
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
    },
};

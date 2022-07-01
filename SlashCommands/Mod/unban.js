const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const {
    confirmButtons,
    modLog,
    randomHex,
} = require("../../handler/functions");
const { fail, success } = require("../../config.json");

module.exports = {
    name: "unban",
    description: "unbans a member from your server",
    userPermissions: ["BAN_MEMBERS"],
    clientPermissions: ["BAN_MEMBERS"],
    options: [
        {
            name: "userid",
            description: "userid you want to unban",
            type: "STRING",
            required: true,
        },
        {
            name: "reason",
            description: "reason for this unban",
            type: "STRING",
            required: false,
        },
    ],

    run: async (client, interaction) => {
        try {
            const id = interaction.options.getString("userid");
            const reason =
                interaction.options.getString("reason") ||
                "`No Reason Provided`";
            const user = await client.users.fetch(id);
            const bans = await interaction.guild.bans.fetch();
            const bannedusers = bans.find((b) => b.user.id == id);

            if (!bannedusers)
                return interaction.followUp({
                    content: `${fail} \`${user.tag}\` is not banned`,
                });

            const embed = new MessageEmbed()
                .setAuthor({
                    name: `${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({
                        dynamic: true,
                    }),
                })
                .setDescription(
                    `**${interaction.user.tag}** are you sure you want to unban **${user.tag}**`
                )
                .setFooter(client.user.tag, client.user.displayAvatarURL())
                .setColor(randomHex())
                .setTimestamp();

            confirmButtons(interaction, {
                embed: embed,
                authorOnly: `Only <@${interaction.member.id}> can use these buttons`,
                yes: {
                    style: "SUCCESS",
                    label: "Unban",
                    emoji: "✔️",
                },
                no: {
                    style: "SECONDARY",
                    label: "Cancel",
                    emoji: "🛑",
                },
            }).then(async (confirm) => {
                if (confirm === "yes") {
                    await interaction.guild.members.unban(user, reason);
                    interaction.editReply({
                        content: `${success} Unbanned **${user.tag}** successfully!`,
                    });
                    modLog(interaction, reason, {
                        Action: "`Unban`",
                        Member: `\`${user.tag}\``,
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
                content: `${fail} This is not a valid user`,
            });
        }
    },
};

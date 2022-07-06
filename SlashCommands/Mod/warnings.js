const { MessageEmbed } = require("discord.js");
const { ButtonPages } = require("leaf-utils"); // my package
const { fail } = require("../../config.json");
const warnModel = require("../../models/warnModel");

module.exports = {
    name: "warnings",
    description: "display all warnings that a user has",
    options: [
        {
            name: "target",
            description: "user you want to view warnings on",
            type: "USER",
            required: true,
        },
    ],

    run: async (client, interaction) => {
        const target = interaction.options.getMember("target");
        const userWarnings = await warnModel.find({
            userId: target.id,
            guildId: interaction.guildId,
        });

        if (!userWarnings || userWarnings.length <= 0)
            return interaction.followUp({
                content: `${fail} ${target} has no warnings`,
            });

        let items = [];
        array = [];
        pages = [];

        if (userWarnings.length > 5) {
            userWarnings.forEach((w, i) => {
                w.index = i + 1;
                if (items.length < 5) items.push(w);
                else {
                    array.push(items);
                    items = [w];
                }
            });
            array.push(items);

            array.forEach((x) => {
                let warns = x
                    .map(
                        (w) =>
                            `Moderator: ${
                                interaction.guild.members.cache.get(
                                    w.moderatorId
                                ) || `${fail}`
                            }\nReason: \`${w.reason}\`\nDate: <t:${parseInt(
                                w.timestamp / 1000
                            )}:R>\nWarnID: \`${w._id}\``
                    )
                    .join("\n\n");

                let emb = new MessageEmbed()
                    .setAuthor({
                        name: `${target.user.tag}` + "'s warnings",
                        iconURL: target.user.displayAvatarURL({
                            dynamic: true,
                        }),
                    })
                    .setDescription(`${warns}`)
                    .setFooter({
                        text: client.user.tag,
                        iconURL: client.user.displayAvatarURL(),
                    })
                    .setColor("#F36605")
                    .setTimestamp();
                pages.push(emb);
            });

            await ButtonPages({
                message: interaction,
                slash_command: true,
                pages: pages,
                time: 300000,
                back: {
                    label: " ",
                    style: "PRIMARY",
                    emoji: "⬅️",
                },
                home: {
                    label: " ",
                    style: "DANGER",
                    emoji: "🏠",
                },
                next: {
                    label: " ",
                    style: "PRIMARY",
                    emoji: "➡️",
                },
                authorOnly: "Only <@{{author}}> can use these buttons!",
            });
        } else {
            let warns = userWarnings
                .map(
                    (w) =>
                        `Moderator: ${
                            interaction.guild.members.cache.get(
                                w.moderatorId
                            ) || `${fail}`
                        }\nReason: \`${w.reason}\`\nDate: <t:${parseInt(
                            w.timestamp / 1000
                        )}:R>\nWarnID: \`${w._id}\``
                )
                .join("\n\n");

            let emb = new MessageEmbed()
                .setAuthor({
                    name: `${target.user.tag}` + "'s warnings",
                    iconURL: target.user.displayAvatarURL({
                        dynamic: true,
                    }),
                })
                .setDescription(`${warns}`)
                .setFooter({
                    text: client.user.tag,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setColor("#F36605")
                .setTimestamp();

            interaction.followUp({
                embeds: [emb],
            });
        }
    },
};

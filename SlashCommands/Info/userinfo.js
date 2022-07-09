const { MessageEmbed } = require("discord.js");
const statuses = {
    online: `\`Online\``,
    idle: `\`AFK\``,
    undefined: `\`Offline\``, // offline members don't have a presence
    dnd: `\`Do Not Disturb\``,
};
const flags = {
    DISCORD_EMPLOYEE: `\`Discord Employee\``,
    DISCORD_PARTNER: `\`Partnered Server Owner\``,
    BUGHUNTER_LEVEL_1: `\`Bug Hunter (Level 1)\``,
    BUGHUNTER_LEVEL_2: `\`Bug Hunter (Level 2)\``,
    HYPESQUAD_EVENTS: `\`HypeSquad Events\``,
    HOUSE_BRAVERY: `\`House of Bravery\``,
    HOUSE_BRILLIANCE: `\`House of Brilliance\``,
    HOUSE_BALANCE: `\`House of Balance\``,
    EARLY_SUPPORTER: `\`Early Supporter\``,
    TEAM_USER: "Team User",
    SYSTEM: "System",
    VERIFIED_BOT: `\`Verified Bot\``,
    VERIFIED_DEVELOPER: `\`Early Verified Bot Developer\``,
};

module.exports = {
    name: "userinfo",
    description: "Displays the userinfo of the specified target.",
    category: "info",
    options: [
        {
            name: "target",
            description: "Select the target.",
            type: "USER",
            required: false,
        },
    ],

    run: async (client, interaction) => {
        const member =
            interaction.options.getMember("target") || interaction.member;
        const userFlags = (await member.user.fetchFlags()).toArray();

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${member.user.tag}`,
                iconURL: member.user.displayAvatarURL({
                    dynamic: true,
                }),
            })
            .addField(
                "Joined server",
                `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
                true
            )
            .addField(
                "Joined Discord",
                `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`,
                true
            )
            .addField("Highest Role", `${member.roles.highest}`, true)
            .addField("Status", `${statuses[member.presence?.status]}`, true)
            .addField("Bot", `\`${member.user.bot}\``, true)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({
                text: "ID: " + member.id,
            })
            .setColor("RED")
            .setTimestamp();

        if (member.presence?.activities) {
            const activitytype = {
                PLAYING: "Playing",
                STREAMING: "Streaming",
                LISTENING: "Listening",
                WATCHING: "Watching",
                CUSTOM: "Custom Status",
                COMPETING: "Competing",
            };

            let activitystring = ``;
            member.presence.activities.forEach((activity) => {
                activitystring += `\n**${activitytype[activity.type]}**${
                    activity.name == `Custom Status`
                        ? `\n${activity.state}`
                        : `\n${activity.name} ${
                              activity.details
                                  ? `- \`${activity.details}\``
                                  : ``
                          }`
                }`;
            });
            if (activitystring.length > 0) embed.setDescription(activitystring);
        }

        if (userFlags.length > 0)
            embed.addField(
                "Badges",
                userFlags.map((flag) => flags[flag]).join("\n")
            );

        interaction.followUp({
            embeds: [embed],
        });
    },
};

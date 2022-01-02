const warnModel = require("../../models/warnModel");
const moment = require("moment");
const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js");
const {
    fail
} = require('../../config.json');

module.exports = {
    name: "warnings",
    description: "display all warnings that a user has",
    userPermissions: ["MANAGE_MESSAGES"],
    options: [{
        name: "target",
        description: "user you want to view warnings on",
        type: "USER",
        required: true,
    }],

    run: async (client, interaction) => {

        const target = interaction.options.getMember("target");
        const userWarnings = await warnModel.find({
            userId: target.id,
            guildId: interaction.guildId,
        });

        if (!userWarnings?.length)
            return interaction.followUp({
                content: `${fail} ${target} has no warnings`,
            });

        const embedDescription = userWarnings
            .map((warn) => {
                const moderator = interaction.guild.members.cache.get(warn.moderatorId);

                return [
                    `Moderator: ${moderator || `${fail}`}`,
                    `Reason: \`${warn.reason}\``,
                    `Date: \`${moment(warn.timestamp).format('MMMM Do YYYY')}\``,
                    `WarnID: \`${warn._id}\``,
                    
                ].join("\n");
            })
            .join("\n\n");

        const embed = new MessageEmbed()
            .setTitle(`${target.user.tag}'s warnings`)
            .setDescription(embedDescription)
            .setColor("RED");

        interaction.followUp({
            embeds: [embed]
        });
    },
};
const { modLog } = require("../../handler/functions");
const { fail, success } = require("../../config.json");

module.exports = {
    name: "unlock",
    description: "unlocks a channel",
    category: "mod",
    options: [
        {
            name: "channel",
            description: "channel to lock",
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"],
            required: true,
        },
        {
            name: "reason",
            description: "reason for this unlock",
            type: "STRING",
            required: false,
        },
    ],

    run: async (client, interaction) => {
        const channel = interaction.options.getChannel("channel");
        const reason =
            interaction.options.getString("reason") || "`No Reason Provided`";

        if (
            channel
                .permissionsFor(interaction.guild.roles.everyone)
                .has("SEND_MESSAGES")
        )
            return interaction.followUp({
                content: `${fail} ${channel} is not locked`,
            });

        channel.permissionOverwrites.edit(interaction.guild.id, {
            SEND_MESSAGES: true,
        });

        interaction.editReply({
            content: `${success} ${channel} unlocked successfully!`,
        });

        modLog(interaction, reason, {
            Action: "`Unlock`",
            Channel: `${channel}`,
        });
    },
};

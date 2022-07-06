const { modLog } = require("../../handler/functions");
const { fail, success } = require("../../config.json");

module.exports = {
    name: "lock",
    description: "locks a channel",
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
            description: "reason for this lock",
            type: "STRING",
            required: false,
        },
    ],

    run: async (client, interaction) => {
        const channel = interaction.options.getChannel("channel");
        const reason =
            interaction.options.getString("reason") || "`No Reason Provided`";

        if (
            !channel
                .permissionsFor(interaction.guild.roles.everyone)
                .has("SEND_MESSAGES")
        )
            return interaction.followUp({
                content: `${fail} ${channel} is already locked`,
            });

        channel.permissionOverwrites.edit(interaction.guild.id, {
            SEND_MESSAGES: false,
        });

        interaction.editReply({
            content: `${success} ${channel} locked successfully!`,
        });

        modLog(interaction, reason, {
            Action: "`Lock`",
            Channel: `${channel}`,
        });
    },
};

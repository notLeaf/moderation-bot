const { fail, success } = require("../../config.json");
const modLogModel = require("../../models/modlogs");

module.exports = {
    name: "modlogs",
    description: "sets the modlog channel",
    category: "config",
    options: [
        {
            name: "enable",
            description: "enable the modlogs system",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    description: "modlogs channel",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true,
                },
            ],
        },
        {
            name: "disable",
            description: "disable the modlogs system",
            type: "SUB_COMMAND",
        },
    ],

    run: async (client, interaction) => {
        const data =
            (await modLogModel.findOne({
                Guild: interaction.guildId,
            })) ||
            (await modLogModel.create({
                Guild: interaction.guildId,
            }));
        channel = interaction.options.getChannel("channel");
        command = interaction.options.getSubcommand();

        if (command === "enable") {
            if (data.Channel === channel.id)
                return interaction.followUp({
                    content: `${fail} This is already the modlogs channel`,
                });

            data.Channel = channel.id;
            data.Enabled = true;
            data.save();

            interaction.followUp({
                content: `${success} Logs have been set to ${channel}`,
            });
        } else if (command === "disable") {
            if (data.Enabled !== true)
                return interaction.followUp({
                    content: `${fail} Modlogs system is already disabled`,
                });

            data.Channel = null;
            data.Enabled = false;
            data.save();

            interaction.followUp({
                content: `${success} Modlogs system has been disabled`,
            });
        }
    },
};

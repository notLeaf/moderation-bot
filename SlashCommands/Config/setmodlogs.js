const { Client, CommandInteraction } = require("discord.js");
const { fail, success } = require("../../config.json");
const modLogModel = require("../../models/modlogs");

module.exports = {
    name: "setmodlogs",
    description: "mod logs channel",
    options: [
        {
            name: "channel",
            description: "channel to send giveaways logs to",
            type: "CHANNEL",
            channelTypes: ["GUILD_TEXT"],
            required: true,
        },
    ],

    run: async (client, interaction) => {
        const channel = interaction.options.getChannel("channel");

        const data = await modLogModel.findOne({
            Guild: interaction.guildId,
        });
        if (data) data.delete();

        new modLogModel({
            Guild: interaction.guildId,
            Channel: channel.id,
        }).save();

        interaction.editReply({
            content: `${success} Logs have been set to ${channel}`,
        });
    },
};

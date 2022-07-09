module.exports = {
    name: "ping",
    description: "websocket ping",
    category: "info",

    run: async (client, interaction) => {
        interaction.followUp({ content: `${client.ws.ping} ms` });
    },
};

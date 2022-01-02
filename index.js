const { Client, Collection } = require("discord.js");

const client = new Client({
    intents: 32767,
});
module.exports = client;

client.slashCommands = new Collection();
client.config = require("./config.json");
client.setMaxListeners(50); require('events').defaultMaxListeners = 50;

require("./handler")(client);

client.login(client.config.token);
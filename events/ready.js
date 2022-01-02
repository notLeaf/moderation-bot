const client = require("../index");

client.on("ready", () => {
    client.user.setActivity(`${client.guilds.cache.size} guilds`, {
        type: 'COMPETING'
    })
    console.log(`✔️ ${client.user.tag}`)
});
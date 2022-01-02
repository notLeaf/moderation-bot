const client = require("../index");

client.on("messageCreate", async (message) => {
    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`)
        return message.channel.send({
            content: `Hi ${message.author} I'm **${client.user.username}**\nA powerful slash Moderation Discord bot`
        })

    if (
        message.author.bot ||
        !message.guild
    )
        return;
});
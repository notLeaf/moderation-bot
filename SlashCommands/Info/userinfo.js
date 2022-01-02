const {
    CommandInteraction,
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: "userinfo",
    description: "Displays the userinfo of the specified target.",
    options: [{
        name: "target",
        description: "Select the target.",
        type: "USER",
        required: false
    }],

    run: async (client, interaction) => {
        const target = interaction.options.getMember("target") || interaction.member;
        await target.user.fetch();

        const response = new MessageEmbed()
            .setColor(target.user.accentColor || "RED")
            .setFooter(target.user.tag, target.user.avatarURL({dynamic: true}))
            .setTimestamp()
            .setThumbnail(target.user.avatarURL({
                dynamic: true
            }))
            .setImage(target.user.bannerURL({
                dynamic: true,
                size: 512
            }) || "")
            .addFields({
                name: "ID",
                value: target.user.id
            }, {
                name: "Joined Server",
                value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
                inline: true
            }, {
                name: "Account Created",
                value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`,
                inline: true
            }, {
                name: "Roles",
                value: target.roles.cache.map(r => r).join(" ").replace("@everyone", "") || "None"
            }, {
                name: "Banner",
                value: target.user.bannerURL() ? "** **" : "None"
            });

        interaction.followUp({
            embeds: [response],
            ephemeral: true
        })
    }
}
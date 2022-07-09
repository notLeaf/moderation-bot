const { SelectMenus } = require("leaf-utils");

module.exports = {
    name: "help",
    description: "Displays a list of all current commands",
    category: "info",

    run: async (client, interaction) => {
        const pages = [
                {
                    title: client.user.username + "'s commands",
                    description: "Click this menu for more info",
                    footer: {
                        text: client.user.tag,
                        icon_url: client.user.displayAvatarURL(),
                    },
                    color: interaction.guild.me.displayHexColor,
                    timestamp: new Date(),
                },
                {
                    title: "Config command",
                    description: client.slashCommands
                        .filter((cmd) => cmd.category === "config")
                        .map((cmd) => `\`${cmd.name}\``)
                        .join(", "),
                    footer: {
                        text: client.user.tag,
                        icon_url: client.user.displayAvatarURL(),
                    },
                    color: "#F3AA05",
                    timestamp: new Date(),
                },
                {
                    title: "Info commands",
                    description: client.slashCommands
                        .filter((cmd) => cmd.category === "info")
                        .map((cmd) => `\`${cmd.name}\``)
                        .join(", "),
                    footer: {
                        text: client.user.tag,
                        icon_url: client.user.displayAvatarURL(),
                    },
                    color: "#F3AA05",
                    timestamp: new Date(),
                },
                {
                    title: "Mod commands",
                    description: client.slashCommands
                        .filter((cmd) => cmd.category === "mod")
                        .map((cmd) => `\`${cmd.name}\``)
                        .join(", "),
                    footer: {
                        text: client.user.tag,
                        icon_url: client.user.displayAvatarURL(),
                    },
                    color: "#F3AA05",
                    timestamp: new Date(),
                },
            ],
            options = [
                {
                    label: "Home",
                    emoji: "🏠",
                },
                {
                    label: "Configuration",
                    emoji: "⚙️",
                },
                {
                    label: "Info",
                    emoji: "ℹ️",
                },
                {
                    label: "Moderation",
                    emoji: "🔨",
                },
            ];

        await SelectMenus({
            message: interaction,
            slash_command: true,
            time: 300000,
            pages: pages,
            options: options,
            authorOnly: {
                enabled: true,
                ephemeral: true,
                authorMessage: "Only <@{{author}}> can use this menu",
            },
            placeholder: "Help Menu",
        });
    },
};

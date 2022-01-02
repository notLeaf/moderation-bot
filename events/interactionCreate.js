const client = require("../index");
const { fail } = require('../config.json')

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd)
            return interaction.followUp({ content: "An error has occured " });

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        if (!interaction.guild.roles.everyone.permissions.has("USE_EXTERNAL_EMOJIS")) {
            return interaction.followUp({
                content: 'The \`@everyone\` role is missing the Permission to \`USE_EXTERNAL_EMOJIS\`, enable it'
            })
        }

        if (!interaction.member.permissions.has(cmd.userPermissions || [])) {
            return interaction.followUp({
                content: `${fail} You need \`${cmd.userPermissions.join(", ")}\` Permissions`
            })
        }

        if (!interaction.guild.me.permissions.has(cmd.clientPermissions || [])) {
            return interaction.followUp({
                content: `${fail} I need \`${cmd.clientPermissions.join(", ")}\` Permissions`
            })
        }

        cmd.run(client, interaction, args);
    }
});
const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js");
const {
    confirmButtons,
    modLog,
    randomHex
} = require('../../handler/functions');
const {
    fail,
    success
} = require('../../config.json')

module.exports = {
    name: 'addrole',
    description: 'adds the specified role to the provided user',
    userPermissions: ["MANAGE_ROLES"],
    clientPermissions: ["MANAGE_ROLES"],
    options: [{
            name: 'target',
            description: 'target to add role to',
            type: 'USER',
            required: true
        },
        {
            name: 'role',
            description: 'role to add',
            type: 'ROLE',
            required: true
        },
        {
            name: 'reason',
            description: 'reason',
            type: 'STRING',
            required: false
        }
    ],

    run: async (client, interaction) => {

        const target = interaction.options.getMember('target');
        const role = interaction.options.getRole('role');
        const reason = interaction.options.getString('reason') || "`No Reason Provided`";

        if (target.id === interaction.member.id) return interaction.followUp({
            content: `${fail} You cannot add a role to yourself`
        });

        if (target.roles.highest.position >= interaction.member.roles.highest.position) return interaction.followUp({
            content: `${fail} This user is higher/equal than you`
        });

        if (target.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({
            content: `${fail} This user is higher/equal than me`
        });

        if (role.position >= interaction.member.roles.highest.position) return interaction.followUp({
            content: `${fail} That role is higher/equal than you`
        });

        if (role.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({
            content: `${fail} That role is higher/equal than me`
        });

        if (target.roles.cache.has(role.id)) return interaction.followUp({
            content: `${fail} User already has the provided role`
        });

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({
                    dynamic: true
                })
            })
            .setDescription(`**${interaction.user.tag}** are you sure you want to add to **${target.user.tag}** the ${role} role`)
            .setFooter(client.user.tag, client.user.displayAvatarURL())
            .setColor(randomHex())
            .setTimestamp()

        confirmButtons(interaction, {
            embed: embed,
            othersMessage: `Only <@${interaction.member.id}> can use these buttons`,
            yes: {
                style: "SUCCESS",
                label: "Add",
                emoji: "✔️"
            },
            no: {
                style: "SECONDARY",
                label: "No",
                emoji: "🛑"
            }
        }).then(async confirm => {
            if (confirm === "yes") {
                await target.roles.add(role);
                interaction.editReply({
                    content: `${success} **${role.name}** was successfully added to **${target.user.tag}**`,
                });
                modLog(interaction, reason, {
                    Action: '`Add Role`',
                    Member: `${target}`,
                    Role: `${role}`,
                })
            }
            if (confirm === "no") {
                interaction.editReply({
                    content: `${fail} **${target.user.tag}** didn't get the **${role.name}** role!`
                })
            }
            if (confirm === "time") {
                interaction.editReply({
                    content: `${fail} Time is up`
                })
            }
        })
    },
};
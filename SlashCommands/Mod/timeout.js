const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js");
const ms = require('ms');
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
    name: 'timeout',
    description: 'time someone out',
    userPermissions: ["MODERATE_MEMBERS"],
    clientPermissions: ["MODERATE_MEMBERS"],
    options: [{
            name: 'target',
            description: 'target to timeout',
            type: 'USER',
            required: true
        },
        {
            name: 'time',
            description: 'amount of time to timeout',
            type: 'STRING',
            required: true,
        },
        {
            name: 'reason',
            description: 'reason for this timeout',
            type: 'STRING',
            required: false
        }
    ],

    run: async (client, interaction) => {

        const target = interaction.options.getMember('target');
        const time = interaction.options.getString('time')
        const reason = interaction.options.getString('reason') || "`No Reason Provided`";
        const timeMs = ms(time);

        if (target.id === interaction.member.id) return interaction.editReply({
            content: `${fail} You cant timeout yourself`
        });

        if (target.id === interaction.guild.me.id) return interaction.editReply({
            content: `${fail} You cant timeout me`
        });

        if (target.id === interaction.guild.ownerId) return interaction.followUp({
            content: `${fail} You cannot mute the server owner`
        });

        if (target.roles.highest.position >= interaction.member.roles.highest.position) return interaction.editReply({
            content: `${fail} This user is higher/equal than you`
        });

        if (target.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.editReply({
            content: `${fail} This user is higher/equal than me`
        });

        if (!timeMs) return interaction.editReply({
            content: `${fail} Specify a valid time`,
            ephemeral: true
        })

        if (timeMs <= 19000) return interaction.editReply({
            content: `${fail} You cannot create a timeout with a duration less than 20 seconds`,
            ephemeral: true
        })

        if (timeMs > 2332800000) return interaction.editReply({
            content: `${fail} You cannot create a timeout lasting longer than 27 days`,
            ephemeral: true
        })

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({
                    dynamic: true
                })
            })
            .setDescription(`**${interaction.user.tag}** are you sure you want to timeout **${target.user.tag}**`)
            .setFooter(client.user.tag, client.user.displayAvatarURL())
            .setColor(randomHex())
            .setTimestamp()

        confirmButtons(interaction, {
            embed: embed,
            othersMessage: `Only <@${interaction.member.id}> can use these buttons`,
            yes: {
                style: "SUCCESS",
                label: "Timeout",
                emoji: "✔️"
            },
            no: {
                style: "SECONDARY",
                label: "No",
                emoji: "🛑"
            }
        }).then(async confirm => {
            if (confirm === "yes") {
                await target.timeout(timeMs, reason)
                interaction.editReply({
                    content: `${success} **${target.user.tag}** has been timeout-ed for **${time}**`,
                });
                modLog(interaction, reason, {
                    Action: '`Timeout`',
                    Member: `${target}`,
                    Time: `\`${time}\``
                })
            }
            if (confirm === "no") {
                interaction.editReply({
                    content: `${fail} **${target.user.tag}** hasn't been timeout-ed!`
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
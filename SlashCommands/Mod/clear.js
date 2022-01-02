const {
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js");
const {
    modLog,
    randomHex
} = require('../../handler/functions');
const {
    fail
} = require('../../config.json')

module.exports = {
    name: 'clear',
    description: 'deletes messages',
    userPermissions: ["MANAGE_MESSAGES"],
    clientPermissions: ["MANAGE_MESSAGES"],
    options: [{
            name: "amount",
            description: "Select the amount messages to delete",
            type: "INTEGER",
            required: true
        },
        {
            name: "channel",
            description: "channel to delete messages",
            type: "CHANNEL",
            required: false
        },
        {
            name: "target",
            description: "Select a target to clear their messages",
            type: "USER",
            required: false
        },
        {
            name: "reason",
            description: "reason for this purge",
            type: "STRING",
            required: false
        }
    ],

    run: async (client, interaction) => {

        const channel = interaction.options.getChannel("channel") || interaction.channel;
        const member = interaction.options.getMember("target");
        const amount = interaction.options.getInteger('amount');
        const reason = interaction.options.getString('reason') || "`No Reason Provided`";

        if (amount < 0 || amount > 100)
            return interaction.followUp({
                content: `${fail} You can only delete 100 messages at once`,
            })

        if (!channel.isText())
            return interaction.followUp({
                content: `${fail} Please select a text channel`
            });

        let messages;
        if (member) {
            messages = (await channel.messages.fetch({
                limit: amount
            })).filter(m => m.member.id === member.id);
        } else messages = amount;

        if (messages.size === 0) {
            return interaction.followup({
                content: `${fail} Unable to find any messages from ${member}`,
            })
        } else {
            await channel.bulkDelete(messages, true).then(messages => {
                const embed = new MessageEmbed()
                    .setDescription(`
                    Successfully deleted **${messages.size}** message(s).
                  `)
                    .addField('Channel', `${channel}`, true)
                    .addField('Message Count', `\`${messages.size}\``, true)
                    .addField('Reason', `${reason}`, true)
                    .setTimestamp()
                    .setColor(randomHex());

                if (member) {
                    embed
                        .spliceFields(1, 1, {
                            name: 'Found Messages',
                            value: `\`${messages.size}\``,
                            inline: true
                        })
                        .spliceFields(1, 0, {
                            name: 'Member',
                            value: `${member}`,
                            inline: true
                        });
                }
                interaction.editReply({
                    embeds: [embed]
                }).catch(() => {});
            })
        }

        const fields = {
            Action: '`Clear`',
            Channel: `${channel}`
        };

        if (member) {
            fields['Member'] = `${member}`;
            fields['Found Messages'] = `\`${messages.size}\``;
        } else fields['Message Count'] = `\`${amount}\``;

        modLog(interaction, reason, fields);
    },
};
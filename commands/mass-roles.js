const {assignRoles} = require("../assign_roles.js");
const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mass-roles')
        .setDescription('Assigns your VATSIM Rating Roles!'),
    async execute(interaction) {
            const guild = interaction.client.guilds.cache.get("901078003482783765");
            const members = await interaction.guild.members.fetch();
            members.forEach(member => assignRoles(member));
        await interaction.reply({content: 'Done!', ephemeral: true}).catch(error =>
            console.error`I failed at the edit reply stage`)
    }
};
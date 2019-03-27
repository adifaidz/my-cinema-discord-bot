const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            group: 'cinema',
            name: 'help',
            memberName: 'help',
            description: 'Displays a list of available commands, or detailed information for a specified command',
        })
    }

    run(message) {
        const prefix = process.env.BOT_PREFIX
        const embed = new RichEmbed()
            .setTitle('List of commands')
            .setColor(0x00AE86)
            .setThumbnail(`https://image.flaticon.com/icons/png/512/864/864818.png`)
            .addField('----------------------',
                `**${prefix}showtime [circuit] [branch] [date]**\n` +
                'Get today\'s showtimes by circuit, branch and date\n\n' +
                `**${prefix}cinema [circuit]**\n` +
                'Get list of cinemas under a circuit\n\n' +
                // `**${prefix}movie [name]**\n` +
                // 'Get movie details\n\n' +
                '***Report any issues at [Github](https://github.com/adifaidz/my-cinema-discord-bot)***')
            .setFooter('cinema.com.my', 'https://image.flaticon.com/icons/png/512/864/864818.png');
        return message.channel.send(embed);
    }
}
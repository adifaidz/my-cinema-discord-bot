const { Command } = require('discord.js-commando')
const Cinema = require('../../cinema')
const { RichEmbed } = require('discord.js')
const _ = require('lodash')

module.exports = class ShowtimeCommand extends Command {
    constructor(client) {
        super(client, {
            group: 'cinema',
            name: 'movie',
            memberName: 'movie',
            description: 'Get movie details',
            args: [
                {
                    key: 'name',
                    prompt: "What movie would you like to query?",
                    type: 'string',
                }
            ],
            examples: ['movie [name]'],
        })
    }

    run(message, {name}) {

        //query movie db
        //populate details into string
        //format it

        const embed = new RichEmbed()
            .setTitle(`${circuit.toUpperCase()} ${_.startCase(response.branch)} Showtimes`)
            .setColor(0x00AE86)
            .setFooter('cinema.com.my', 'https://image.flaticon.com/icons/png/512/864/864818.png')
            .addField('-----------------------', showtimeStr)
        
        return message.channel.send(embed)
    }
}
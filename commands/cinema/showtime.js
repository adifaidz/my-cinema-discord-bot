const { Command } = require('discord.js-commando')
const Cinema = require('../../cinema')
const { RichEmbed } = require('discord.js')
const _ = require('lodash')

module.exports = class ShowtimeCommand extends Command {
    constructor(client) {
        super(client, {
            group: 'cinema',
            name: 'showtime',
            memberName: 'showtime',
            description: 'Get today\'s showtimes by circuit and branch',
            args: [
                {
                    key: 'circuit',
                    prompt: "Which of these circuit would you like to query for? [ tgv, mbo, gsc ]",
                    type: 'string',
                    oneOf: Object.values(Cinema.circuits)
                },
                {
                    key: 'branch',
                    prompt: 'What branch would you like to query for?',
                    type: 'string'
                }
            ],
            examples: ['showtime [circuit] [branch]'],
        })
    }

    run(message, {circuit, branch}) {
        circuit = circuit.toLowerCase(), branch = branch.toLowerCase()

        Cinema.findShowtimesByCinema(circuit, branch).then((response) => {
            if (_.isEmpty(response) || _.isEmpty(response.showtimes))
                return message.reply('cannot find the showtimes. Maybe try something else?')

            let showtimeStr = '', showtimes = response.showtimes
            showtimes.forEach((showtime, i) => {
                let {
                    title,
                    duration,
                    times
                } = showtime
                showtimeStr += `**${title}**\t\t${duration}\n`
                times.forEach((time, i) => {
                    showtimeStr += `${time}\t\t`
                })
                showtimeStr += `\n\n`
            })

            const embed = new RichEmbed()
                .setTitle(`${circuit.toUpperCase()} ${_.startCase(response.branch)} Showtimes`)
                .setColor(0x00AE86)
                .setFooter('cinema.com.my', 'https://image.flaticon.com/icons/png/512/864/864818.png')
                .addField('-----------------------', showtimeStr)
            
            return message.channel.send(embed)
        }).catch((error) => {
            console.log(error)
            return message.reply('something went wrong. Try again later')
        })
    }
}
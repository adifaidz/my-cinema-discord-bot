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
                    prompt: 'Which of these circuit [ tgv, mbo, gsc ], would you like to query for?',
                    type: 'string',
                    oneOf: Object.values(Cinema.circuits)
                },
                {
                    key: 'branch',
                    prompt: 'What branch would you like to query for?',
                    type: 'string'
                },
                {
                    key: 'date',
                    prompt: `What date (DDMMYY) would you like to query for? Send` + ' `-` for today',
                    type: 'string',
                }
            ],
            examples: ['showtime [circuit] [branch] [date]'],
        })
    }

    async run(message, {circuit, branch, date}) {
        circuit = circuit.toLowerCase(), branch = branch.toLowerCase()
        
        let api

        if(!date || date === '-')
            api = Cinema.findShowtimesByCinema(circuit, branch)
        else
            api = Cinema.findShowtimesByCinemaAndDate(circuit, branch, date)

        api.then((response) => {
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
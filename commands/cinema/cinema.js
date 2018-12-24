const { Command } = require('discord.js-commando')
const Cinema = require('../../cinema')
const { RichEmbed } = require('discord.js')
const _ = require('lodash')

module.exports = class CinemaCommand extends Command {
    constructor(client) {
        super(client, {
            group: 'cinema',
            name: 'cinema',
            memberName: 'cinema',
            description: 'Get list of cinemas under a circuit',
            args: [{
                key: 'circuit',
                prompt: "Which of these circuit would you like to query for? [ tgv, mbo, gsc ]",
                type: 'string',
                oneOf: Object.values(Cinema.circuits)
            }],
            parse: function (val) {
                return val.toLowerCase()
            },
            examples: ['cinema [circuit]'],
        })
    }

    run(message, { circuit }) {
        circuit = circuit.toLowerCase()
        Cinema.findCinemasByCircuit(circuit).then((cinemas) => {
            if (_.isEmpty(cinemas)) 
                return message.reply('cannot find the cinema. Maybe try something else?')

            let cinemaStr = ''
            cinemas.forEach((cinema, i) => {
                cinemaStr += `- ${cinema}\n`
            })

            const embed = new RichEmbed()
                .setTitle(`${circuit.toUpperCase()} Cinemas`)
                .setColor(0x00AE86)
                .setFooter('cinema.com.my', 'https://image.flaticon.com/icons/png/512/864/864818.png')
                .addField('-----------------------', cinemaStr)

            return message.channel.send(embed)
        }).catch((error) => {
            console.log(error)
            return message.reply('something went wrong. Try again later')
        })
    }
}
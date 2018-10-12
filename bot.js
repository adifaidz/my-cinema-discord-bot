const _ = require('lodash')
const Cinema = require('./cinema')
const {RichEmbed} = require('discord.js')

const settings = {
    color : 0x00AE86,
}

function findShowtimesByCinema(message, circuit, cinema) {
    Cinema.findShowtimesByCinema(circuit, cinema).then((branch) => {
        if (_.isEmpty(branch) ||_.isEmpty(branch.showtimes)){
            message.reply('cannot find the showtimes. Maybe try something else?')
            return
        }

        const embed = new RichEmbed()
            .setTitle(`${circuit.toUpperCase()} ${_.startCase(branch.name)} Showtimes`)
            .setColor(settings.color)
            .setFooter('cinema.com.my', 'https://image.flaticon.com/icons/png/512/864/864818.png');

        let showtimeStr = '', showtimes = branch.showtimes

        showtimes.forEach((showtime, i )=>{
            let {title, duration, times} = showtime
            showtimeStr += `**${title}**\t\t${duration}\n`            
            times.forEach((time, i) => {
                showtimeStr += `${time}\t\t`
            })
            showtimeStr += `\n\n`
        })
        embed.addField('-----------------------',showtimeStr)
        message.channel.send(embed)

    }).catch((error) => {
        console.log(error)
        if (error.name === 'CinemaNotFoundException') {
            message.reply(error.message)
            return
        }
        message.reply('something went wrong. Try again later')
    })
}

function findCinemasByCircuit(message, circuit) {
    Cinema.findCinemasByCircuit(circuit).then((cinemas) => {
        if (_.isEmpty(cinemas)) {
            message.reply('cannot find the cinema. Maybe try something else?')
            return
        }

        const embed = new RichEmbed()
            .setTitle(`${circuit.toUpperCase()} Cinemas`)
            .setColor(settings.color)
            .setFooter('cinema.com.my', 'https://image.flaticon.com/icons/png/512/864/864818.png');

        var cinemaStr = ''
        cinemas.forEach((cinema, i) => {
            cinemaStr += `- ${cinema}\n`;
        })
        embed.addField('-----------------------', cinemaStr)
        message.channel.send(embed)

    }).catch((error) => {
        console.log(error)
        if (error.name === 'CinemaNotFoundException') {
            message.reply(error.message)
            return
        }
        message.reply('something went wrong. Try again later')
    })
}

function help(message, prefix){
    const embed = new RichEmbed()
        .setTitle('List of commands')
        .setColor(65415)
        .setThumbnail(`https://image.flaticon.com/icons/png/512/864/864818.png`)
        .addField('----------------------',
            `**${prefix}showtime [circuit] [branch]**\n` +
            'Get today\'s showtimes by circuit and branch\n\n' +
            `**${prefix}cinema [circuit]**\n` +
            'Get list of cinemas under a circuit\n\n' +
            '***Report any issues at [Github](https://github.com/adifaidz/my-cinema-discord-bot)***')
        .setFooter('cinema.com.my', 'https://image.flaticon.com/icons/png/512/864/864818.png');
    message.channel.send(embed);
}

module.exports = {
    findShowtimesByCinema,
    findCinemasByCircuit,
    help
}
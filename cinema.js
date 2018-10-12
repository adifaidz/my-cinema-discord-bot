const _ = require('lodash')
const service = require('./service')
const cheerio = require('cheerio')
const jsonframe = require('jsonframe-cheerio')
const circuits = {
    gsc: 'gsc',
    tgv: 'tgv',
    mbo: 'mbo'
}

async function findShowtimesByCinema(circuit, cinema){
    validateCircuit(circuit);
    return await service.getShowtimes(circuit).then((response) => {
        let $ = cheerio.load(response)
        let branch = _.filter($('h4>span'),(el) => {
            return $(el).text().toLowerCase().indexOf(cinema.toLowerCase()) > -1
        })[0]

        if(!branch)
            return {}

        let headerElement = $(branch).parent()
        var start = false, end = false
        let showtimes = []

        while(end === false){
            if (!start && headerElement.next().attr('id') === 'ShowtimesList')
                start = true

            if (start && headerElement.next().attr('id') !== 'ShowtimesList')
                end = true

            if (!end && headerElement.next().attr('id') === 'ShowtimesList'){
                let showtime = $(headerElement.next())
                let times = []
                showtime.children('div').each((i, element) => {
                    let time = $(element).text().substring(0, 7)
                                .replace(/.{2}$/, ' $&')
                    times.push(time)
                })

                showtimes.push({
                    title: $(showtime).find('a>b').text(),
                    duration : $(showtime).find('i').text()
                                .split(',')[0]
                                .replace(/ Hours?/, 'h')
                                .replace(/ Minutes?/, 'm'),
                    times
                })
            }

            headerElement = headerElement.next()
        }

        return {
            name: $(branch).text().split('-')[1].split(',')[0],
            showtimes
        }
    })
}

async function findCinemasByCircuit(circuit) {
    validateCircuit(circuit);
    return await service.getCinemas().then((response) => {
        let $ = cheerio.load(response)
        jsonframe($)

        let result = $('body .section_content').scrape({
            'cinemas': [`a:contains('${circuit.toUpperCase()}-')`]
        })
        result = _.map(result.cinemas, function(cinema){
            return cinema.replace(`${circuit.toUpperCase()}-`, '')
        });

        return result;
    })
}

module.exports = {
    findShowtimesByCinema,
    findCinemasByCircuit,
}

function validateCircuit(circuit) {
    if (Object.values(circuits).indexOf(circuit) === -1)
        throw {
            name: 'CinemaNotFoundException',
            message: 'cinema was not supported. Are you sure you input the right one?'
        }
}
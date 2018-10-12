const axios = require('axios')
const baseURL = "http://www.cinema.com.my";

function getCinemas(circuit){
    return fetchPage(`${baseURL}/cinemas/cinemalist.aspx`);
}

function getShowtimes(circuit) {
    return fetchPage(`${baseURL}/showtimes/cinemas${circuit}.aspx`);
}

async function fetchPage(url, section, config = {}){
    return new Promise((resolve, reject) => {
        axios.get(url, config).then((response) => {
            const data = response.data;
            resolve(data);
        });
    });
}

module.exports = {
    getCinemas,
    getShowtimes,
}
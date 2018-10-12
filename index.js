require('dotenv').config();

const bot = require('./bot');
const {Client} = require('discord.js');

const client = new Client();
const PREFIX = process.env.BOT_PREFIX;

var http = require("http");
setInterval(function () {
    http.get("http://cinema-discord-bot.herokuapp.com/");
}, 300000); // every 5 minutes (300000)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    if (message.author.bot) return;
    if (message.content.indexOf(PREFIX) !== 0) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const content = args.join(' ');

    if(command === "showtime"){
        bot.findShowtimesByCinema(message, args[0], args.slice(1).join(' '));
    }
    else if (command === "cinema") {
        bot.findCinemasByCircuit(message, args[0]);
    }
    else if (command === "help") {
        bot.help(message, PREFIX);
    }
});

client.login(process.env.BOT_TOKEN);
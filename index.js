
var http = require("http")
setInterval(function () {
    http.get("http://cinema-discord-bot.herokuapp.com/")
}, 300000) // every 5 minutes (300000)

require('dotenv').config()
var bugsnag = require('@bugsnag/js')
var bugsnagClient = bugsnag(process.env.BUGSNAG_API_KEY)

const path = require('path')
const { CommandoClient } = require('discord.js-commando')
const client = new CommandoClient({
    commandPrefix: process.env.BOT_PREFIX,
    owner: process.env.BOT_OWNER,
    disableEveryone: true
})

client.registry
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands({
        help: false, prefix: false, ping: false, eval: false, commandState: false
    })
    .registerGroups([
        ['cinema', 'Cinema']
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'))

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.login(process.env.BOT_TOKEN)

'use strict'

const Telegraf = require('telegraf')

const telegramOpts = {
    token: process.env.TELEGRAM_BOT_TOKEN,
    allowerUsers: process.env.TELEGRAM_ALLOWED_USERS,
}

module.exports = function(app) {

    if (!telegramOpts.token) {
        console.log('Telegeram bot is disabled, set TELEGRAM_BOT_TOKEN and TELEGRAM_ALLOWED_USERS to run it')
        return
    }

    const Note = app.models.Note
    const bot = new Telegraf(telegramOpts.token)
    const usersAllowed = telegramOpts.allowerUsers ? telegramOpts.allowerUsers.split(',') : []

    // filter by users
    bot.use((ctx, next) => {
        if (usersAllowed.includes(ctx.from.username)) next()
        else {
            console.log(`${ctx.from.username} tried to use this bot`)
            ctx.reply('You do not have access to this bot. Go away!')
        }
    })

    // store message in DB
    bot.on('text', async (ctx) => {
        if (ctx.message && ctx.message.text) {
            const note = await Note.create({
                created_at: new Date(),
                body: ctx.message.text
            })

            if (note.id) ctx.reply(`Written ${ctx.message.text.length} characters`)
            else ctx.reply('Error while writing to DB')
        }
    })

    bot.launch()

    console.log('Telegram Bot Started!')
}
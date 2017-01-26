const config = require('config');
const TelegramBot = require('node-telegram-bot-api');

const db = require('./db');


const token = config.get('telegram.token');
const button = config.get('bot.button');


const createReplyMarkup = button => JSON.stringify({
    keyboard: [ [ button ] ],
    resize_keyboard: true
});


const bot = new TelegramBot(token, { polling: true });
const replyMarkupKeyboard = createReplyMarkup(button);

bot.onText(/.*/, message => {
    bot.sendPhoto(message.chat.id, 'placeholder.png', {
        reply_markup: replyMarkupKeyboard
    });

    db.saveMessage(message);
});
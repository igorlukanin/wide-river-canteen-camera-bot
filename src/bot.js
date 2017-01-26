const config = require('config');
const fs = require('fs');
const request = require('request');
const TelegramBot = require('node-telegram-bot-api');

const db = require('./db');


const token = config.get('telegram.token');
const button = config.get('bot.button');
const username = config.get('camera.username');
const password = config.get('camera.password');
const snapshotUri = config.get('camera.snapshotUri');
const cacheIntervalMs = config.get('camera.cacheIntervalMs');
const cacheTemporaryPath = './snapshot-temporary.jpeg';
const cachePath = './snapshot.jpeg';


const updateSnapshot = () => request(snapshotUri)
    .auth(username, password)
    .pipe(fs.createWriteStream(cacheTemporaryPath))
    .on('close', () => {
        fs.createReadStream(cacheTemporaryPath)
            .pipe(fs.createWriteStream(cachePath));
    });

const createReplyMarkup = button => JSON.stringify({
    keyboard: [ [ button ] ],
    resize_keyboard: true
});


// Schedule snapshot updates

updateSnapshot();

setInterval(updateSnapshot, cacheIntervalMs);


// Start the bot

const bot = new TelegramBot(token, { polling: true });
const replyMarkupKeyboard = createReplyMarkup(button);

bot.onText(/.*/, message => {
    bot.sendPhoto(message.chat.id, cachePath, {
        reply_markup: replyMarkupKeyboard
    });

    db.saveMessage(message);
});
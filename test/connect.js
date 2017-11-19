const TelegramBot = require('node-telegram-bot-api');
const Chat = require('../src/chat.class');
const db = require('then-flat-file-db')(require('flat-file-db')('./data.db'));

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});

const admins = {
    22863732: 'slavikme'
};

const chats = {};

function saveChat(chat_id, chat_data, date)
{
    chats[chat_id] = new Chat(chat_id, chat_data, date);
}

bot.on('message', msg => {
    msg.chat && msg.chat.id && (chats[msg.chat.id] || saveChat(msg.chat.id, msg.chat, msg.date));
});



bot.onText(/^\/(start|info|help)$/, msg => {
    bot.sendMessage(msg.chat.id, "Welcome!\nThis bot will provide you with the most interesting content from http://vsetutonline.com.\n/help - Will print you the following message.\n/status - Will give you the status of the website.\n\nStay tuned!");
});

bot.onText(/^\/admin (.+)$/, (msg, matches) => {
    const cmd = matches[1];
    if ( !admins[msg.from.id] || msg.chat.type !== "private" ) return;
    switch ( cmd )
    {
        case "show chats":
            for ( let cid in chats ) {
                bot.sendMessage(msg.chat.id, JSON.stringify(chats[cid]));
            }
            break;
    }
});
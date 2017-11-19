const TelegramBot = require('node-telegram-bot-api');
const Chat = require('../src/chat.class');
const db = require('then-flat-file-db')(require('flat-file-db')('./data.db'));

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});

const admins = {
    22863732: 'slavikme'
};

const chats = {};

function saveChat(chat_id, chat_data, date) {
    chats[chat_id] = new Chat(chat_id, chat_data, date);
}

bot.on('message', msg => {
    msg.chat && msg.chat.id && (chats[msg.chat.id] || saveChat(msg.chat.id, msg.chat, msg.date));
});

const supported_commands = {
    admin: [],
    all: {
        'all': 'Show all available information',
        'message_id': 'Current message ID',
        'chat_id': 'The chat ID between you and the bot',
        'chat_type': 'The type of the chat between you and te bot',
        'message_date': 'The Epoch time of this message in seconds',
    },
};

const message_options = {parse_mode:'Markdown'};

const buildCommandsMessage = list => {
    let result = '';
    for (let command in list) {
        if (!list.hasOwnProperty(command)) continue;
        let description = list[command];
        result += `\`${command}\` - ${description}\n`
    }
    return result;
};

const getCommandFromMessage = (command, message) => {
    switch (command) {
        case 'all':
            return Object.keys(supported_commands.all).map(cmd => cmd!=='all' && `${cmd}: ${getCommandFromMessage(cmd, message)}`).filter(Boolean).join('\n');
        case 'message_id': return message.message_id;
        case 'chat_id': return message.chat.id;
        case 'chat_type': return message.chat.type;
        case 'message_date': return message.date;
        default:
            return null;
    }
};

bot.onText(/^\/(start|info|help)$/, msg => {
    bot.sendMessage(msg.chat.id, "*Welcome!*\nThis bot is currently in a test mode.\n/help /info /start - Will print you this message.\n/get - Retrieves chat related information.", message_options);
});

bot.onText(/^\/get(?:$|\s+(.+))/, (msg, [, cmd]) => {
    const result = getCommandFromMessage(cmd, msg);
    if (!result) {
        bot.sendMessage(msg.chat.id, `*Usage*\n\`/get [command]\`\n\n*Available Commands*\n${buildCommandsMessage(supported_commands.all)}`, message_options)
        return;
    }
    bot.sendMessage(msg.chat.id, result);
});

bot.onText(/^\/admin (.+)$/, (msg, matches) => {
    const cmd = matches[1];
    if (!admins[msg.from.id] || msg.chat.type !== "private") return;
    switch (cmd) {
        case "show chats":
            for (let cid in chats) {
                bot.sendMessage(msg.chat.id, JSON.stringify(chats[cid]));
            }
            break;
    }
});
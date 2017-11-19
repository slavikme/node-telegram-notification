class ChatError extends Error {
    constructor (msg, id = null) {
        super(msg, id);
    }
}

module.exports = ChatError;
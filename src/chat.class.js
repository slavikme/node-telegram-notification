const ChatError = require('error/chat-error.class');

const VALID_CHAT_TYPES = ['private', 'group'];
const MICROSECONDS_SEPARATOR_TIME = 1000000000000;

class Chat {

    // /** @type number */
    // _id;
    //
    // /** @type string */
    // _type;
    //
    // /** @type string */
    // _first_name;
    //
    // /** @type string */
    // _last_name;
    //
    // /** @type string */
    // _username;
    //
    // /** @type boolean */
    // _all_members_are_administrators;
    //
    // /** @type Date */
    // _time;

    /**
     * Telegram chat class
     *
     * @param {number|object} chat_id Chat ID or chat data.
     * @param {object|number} chat_data Chat data or time.
     * @param {number|Date} time The creation time of the chat.
     *
     * @examples
     * const chat = new Chat(123);
     * const chat = new Chat(123, {id:123, type:'group', ...});
     * const chat = new Chat(123, {id:123, type:'group', ...}, 1499581606);
     * const chat = new Chat(123, {id:123, type:'group', ...}, 1499581606297);
     * const chat = new Chat(123, {id:123, type:'group', ...}, new Date);
     * const chat = new Chat({id:123, type:'group', ...});
     * const chat = new Chat({id:123, type:'group', ...}, new Date);
     */
    constructor(chat_id, chat_data = undefined, time = new Date) {
        if (!chat_id) {
            throw new ChatError("Argument #1 is required");
        }

        if (typeof chat_id === 'object') {
            chat_data = chat_id;
            if (chat_data instanceof Date || !isNaN(chat_data)) {
                time = chat_data;
            }
        }
        else {
            this.setId(chat_id);
        }
        chat_data && this.extractAndSaveData(chat_data);
        this.setTime(time);
    }

    /**
     *
     * @param chat_data
     */
    extractAndSaveData(chat_data) {
        if (typeof chat_data !== 'object') {
            throw new ChatError(`Expected string value, got ${typeof chat_data} (${chat_data})`);
        }

        const {id, type} = chat_data;

        if (this.getId() && this.getId() !== id) {
            throw new ChatError("Stored chat ID and the ID in the chat data must match");
        }

        this.setId(id);
        this.setType(type);

        switch (type) {
            case 'private':
                const {first_name, last_name, username} = chat_data;
                this.setTitle(`${first_name} ${last_name}`);
                this.setFirstName(first_name);
                this.setLastName(last_name);
                this.setUsername(username);
                break;

            case 'group':
                const {title, all_members_are_administrators} = chat_data;
                this.setTitle(chat_data);
                this.setAllMembersAreAdministrators(all_members_are_administrators);
                break;
        }
    }

    /**
     *
     * @param id
     */
    setId(id) {
        if (isNaN(id)) {
            throw new ChatError(`Expected numeric value, got ${typeof id} (${id})`);
        }
        if (!id) {
            throw new ChatError("Chat ID cannot be empty");
        }
        this._id = id;
    }

    /**
     *
     * @param type
     */
    setType(type) {
        if (!type) {
            throw new ChatError("Chat type cannot be empty");
        }
        if (VALID_CHAT_TYPES.indexOf(type) === -1) {
            throw new ChatError(`Unfamiliar type '${type}'`);
        }
        this._type = type;
    }

    /**
     *
     * @param title
     */
    setTitle(title) {
        if (!title) {
            throw new ChatError("Chat title cannot be empty");
        }
        if (typeof title !== 'string') {
            throw new ChatError(`Expected string value, got ${typeof title} (${title})`);
        }
        this._title = title;
    }

    /**
     *
     * @param first_name
     */
    setFirstName(first_name) {
        if (typeof first_name !== 'string') {
            throw new ChatError(`Expected string value, got ${typeof first_name} (${first_name})`);
        }
        this._first_name = first_name;
    }

    /**
     *
     * @param last_name
     */
    setLastName(last_name) {
        if (typeof last_name !== 'string') {
            throw new ChatError(`Expected string value, got ${typeof last_name} (${last_name})`);
        }
        this._last_name = last_name;
    }

    /**
     *
     * @param username
     */
    setUsername(username) {
        if (!username) {
            throw new ChatError("Username cannot be empty");
        }
        if (typeof username !== 'string') {
            throw new ChatError(`Expected string value, got ${typeof username} (${username})`);
        }
        this._username = username;
    }

    /**
     *
     * @param all_members_are_administrators
     */
    setAllMembersAreAdministrators(all_members_are_administrators) {
        if (typeof all_members_are_administrators !== 'boolean') {
            throw new ChatError(`Expected boolean value, got ${typeof all_members_are_administrators} (${all_members_are_administrators})`);
        }
        this._all_members_are_administrators = all_members_are_administrators;
    }

    /**
     *
     * @param {number|Date} time
     */
    setTime(time) {
        if (!time) {
            throw new ChatError("Chat creation time cannot be empty");
        }
        if (!isNaN(time)) {
            time = new Date(time * (time < MICROSECONDS_SEPARATOR_TIME ? 1000 : 1));
        }
        if (!(time instanceof Date)) {
            throw new ChatError(`Unfamiliar time format '${time}'`);
        }
        this._time = time;
    }

    /**
     *
     * @returns {number}
     */
    getId() {
        return this._id;
    }

    /**
     *
     * @returns {string}
     */
    getType() {
        return this._type;
    }

    /**
     *
     * @returns {string}
     */
    getTitle() {
        return this._title;
    }

    /**
     *
     * @returns {string}
     */
    getFirstName() {
        return this._first_name;
    }

    /**
     *
     * @returns {string}
     */
    getLastName() {
        return this._last_name;
    }

    /**
     *
     * @returns {string}
     */
    getUsername() {
        return this._username;
    }

    /**
     *
     * @returns {boolean}
     */
    isAllMembersAreAdministrators() {
        return this._all_members_are_administrators;
    }

    /**
     *
     * @returns {Date}
     */
    getTime() {
        return this._time;
    }
}

module.exports = Chat;
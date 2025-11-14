"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const vcf_1 = __importDefault(require("vcf"));
class Context {
    constructor(update, api, botInfo) {
        this.update = update;
        this.api = api;
        this.botInfo = botInfo;
    }
    has(filters) {
        for (const filter of Array.isArray(filters) ? filters : [filters]) {
            if (typeof filter === 'function'
                ? filter(this.update)
                : filter === this.update.update_type) {
                return true;
            }
        }
        return false;
    }
    assert(value, method) {
        if (value === undefined) {
            throw new TypeError(`Max: "${method}" isn't available for "${this.updateType}"`);
        }
    }
    get updateType() {
        return this.update.update_type;
    }
    get myId() {
        return this.botInfo?.user_id;
    }
    get startPayload() {
        return getStartPayload(this.update);
    }
    get chat() {
        return getChat(this.update);
    }
    get chatId() {
        return getChatId(this.update);
    }
    get message() {
        return getMessage(this.update);
    }
    get messageId() {
        return getMessageId(this.update);
    }
    get callback() {
        return getCallback(this.update);
    }
    get user() {
        return getUser(this.update);
    }
    get contactInfo() {
        return (this._contactInfo ?? (this._contactInfo = getContactInfo(this.update)));
    }
    get location() {
        return (this._location ?? (this._location = getLocation(this.update)));
    }
    get sticker() {
        return (this._sticker ?? (this._sticker = getSticker(this.update)));
    }
    async reply(text, extra) {
        this.assert(this.chatId, 'reply');
        return this.api.sendMessageToChat(this.chatId, text, extra);
    }
    async getAllChats(extra) {
        return this.api.getAllChats(extra);
    }
    async getChat(chatId) {
        if (chatId !== undefined) {
            return this.api.getChat(chatId);
        }
        this.assert(this.chatId, 'getChat');
        return this.api.getChat(this.chatId);
    }
    async getChatByLink(link) {
        return this.api.getChatByLink(link);
    }
    async editChatInfo(extra) {
        this.assert(this.chatId, 'editChatInfo');
        return this.api.editChatInfo(this.chatId, extra);
    }
    async getMessage(id) {
        return this.api.getMessage(id);
    }
    async getMessages(extra) {
        this.assert(this.chatId, 'getMessages');
        return this.api.getMessages(this.chatId, extra);
    }
    async getPinnedMessage() {
        this.assert(this.chatId, 'getPinnedMessage');
        return this.api.getPinnedMessage(this.chatId);
    }
    async editMessage(extra) {
        this.assert(this.messageId, 'editMessage');
        return this.api.editMessage(this.messageId, extra);
    }
    async deleteMessage(messageId) {
        if (messageId !== undefined) {
            return this.api.deleteMessage(messageId);
        }
        this.assert(this.messageId, 'deleteMessage');
        return this.api.deleteMessage(this.messageId);
    }
    async answerOnCallback(extra) {
        this.assert(this.callback, 'answerOnCallback');
        return this.api.answerOnCallback(this.callback.callback_id, extra);
    }
    async getChatMembership() {
        this.assert(this.chatId, 'getChatMembership');
        return this.api.getChatMembership(this.chatId);
    }
    async getChatAdmins() {
        this.assert(this.chatId, 'getChatAdmins');
        return this.api.getChatAdmins(this.chatId);
    }
    async addChatMembers(userIds) {
        this.assert(this.chatId, 'addChatMembers');
        return this.api.addChatMembers(this.chatId, userIds);
    }
    async getChatMembers(extra) {
        this.assert(this.chatId, 'getChatMembers');
        return this.api.getChatMembers(this.chatId, extra);
    }
    async removeChatMember(userId) {
        this.assert(this.chatId, 'removeChatMember');
        return this.api.removeChatMember(this.chatId, userId);
    }
    async pinMessage(messageId, extra) {
        this.assert(this.chatId, 'pinMessage');
        return this.api.pinMessage(this.chatId, messageId, extra);
    }
    async unpinMessage() {
        this.assert(this.chatId, 'unpinMessage');
        return this.api.unpinMessage(this.chatId);
    }
    async sendAction(action) {
        this.assert(this.chatId, 'sendAction');
        return this.api.sendAction(this.chatId, action);
    }
    async leaveChat() {
        this.assert(this.chatId, 'leaveChat');
        return this.api.leaveChat(this.chatId);
    }
}
exports.Context = Context;
const getChatId = (update) => {
    if ('chat_id' in update) {
        return update.chat_id;
    }
    if ('message' in update && update.message && 'recipient' in update.message) {
        return update.message.recipient.chat_id;
    }
    if ('chat' in update) {
        return update.chat.chat_id;
    }
    return undefined;
};
const getChat = (update) => {
    if ('chat' in update) {
        return update.chat;
    }
    return undefined;
};
const getMessage = (update) => {
    if ('message' in update) {
        return update.message;
    }
    return undefined;
};
const getMessageId = (update) => {
    if ('message_id' in update) {
        return update.message_id;
    }
    if ('message' in update) {
        return update.message?.body.mid;
    }
    return undefined;
};
const getCallback = (update) => {
    if ('callback' in update) {
        return update.callback;
    }
    return undefined;
};
const getContactInfo = (update) => {
    const message = getMessage(update);
    if (!message)
        return undefined;
    const contact = message.body.attachments?.find((attachment) => {
        return attachment.type === 'contact';
    });
    if (!contact?.payload.vcf_info)
        return undefined;
    // eslint-disable-next-line new-cap
    const vcf = new vcf_1.default().parse(contact.payload.vcf_info);
    return {
        tel: vcf.get('tel').valueOf(),
        fullName: vcf.get('fn').valueOf(),
    };
};
const getLocation = (update) => {
    const message = getMessage(update);
    if (!message)
        return undefined;
    const location = message.body.attachments?.find((attachment) => {
        return attachment.type === 'location';
    });
    if (!location)
        return undefined;
    return {
        latitude: location.latitude,
        longitude: location.longitude,
    };
};
const getSticker = (update) => {
    const message = getMessage(update);
    if (!message)
        return undefined;
    const sticker = message.body.attachments?.find((attachment) => {
        return attachment.type === 'sticker';
    });
    if (!sticker)
        return undefined;
    return {
        width: sticker.width,
        height: sticker.height,
        url: sticker.payload.url,
        code: sticker.payload.code,
    };
};
const getUser = (update) => {
    if ('user' in update) {
        return update.user;
    }
    if (update.update_type === 'message_callback') {
        return update.callback.user;
    }
    if (update.update_type === 'message_created') {
        return update.message.sender || undefined;
    }
    return undefined;
};
const getStartPayload = (update) => {
    if (update.update_type === 'bot_started') {
        return update.payload;
    }
    return undefined;
};

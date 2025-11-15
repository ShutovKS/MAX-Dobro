"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
const attachments_1 = require("./core/helpers/attachments");
const upload_1 = require("./core/helpers/upload");
const api_1 = require("./core/network/api");
class Api {
    constructor(client) {
        this.getMyInfo = async () => {
            return this.raw.bots.getMyInfo();
        };
        this.editMyInfo = async (extra) => {
            return this.raw.bots.editMyInfo(extra);
        };
        this.setMyCommands = async (commands) => {
            return this.editMyInfo({ commands });
        };
        this.deleteMyCommands = async () => {
            return this.editMyInfo({ commands: [] });
        };
        this.getAllChats = async (extra = {}) => {
            return this.raw.chats.getAll(extra);
        };
        this.getChat = async (id) => {
            return this.raw.chats.getById({ chat_id: id });
        };
        this.getChatByLink = async (link) => {
            return this.raw.chats.getByLink({ chat_link: link });
        };
        this.editChatInfo = async (chatId, extra) => {
            return this.raw.chats.edit({ chat_id: chatId, ...extra });
        };
        this.sendMessageToChat = async (chatId, text, extra) => {
            const { message } = await this.raw.messages.send({
                chat_id: chatId,
                text,
                ...extra,
            });
            return message;
        };
        this.sendMessageToUser = async (userId, text, extra) => {
            const { message } = await this.raw.messages.send({
                user_id: userId,
                text,
                ...extra,
            });
            return message;
        };
        this.getMessages = async (chatId, { message_ids, ...extra } = {}) => {
            return this.raw.messages.get({
                chat_id: chatId,
                message_ids: message_ids?.join(','),
                ...extra,
            });
        };
        this.getMessage = async (id) => {
            return this.raw.messages.getById({ message_id: id });
        };
        this.editMessage = async (messageId, extra) => {
            return this.raw.messages.edit({
                message_id: messageId,
                ...extra,
            });
        };
        this.deleteMessage = async (messageId, extra) => {
            return this.raw.messages.delete({ message_id: messageId, ...extra });
        };
        this.answerOnCallback = async (callbackId, extra) => {
            return this.raw.messages.answerOnCallback({ callback_id: callbackId, ...extra });
        };
        this.getChatMembership = (chatId) => {
            return this.raw.chats.getChatMembership({ chat_id: chatId });
        };
        this.getChatAdmins = (chatId) => {
            return this.raw.chats.getChatAdmins({ chat_id: chatId });
        };
        this.addChatMembers = (chatId, userIds) => {
            return this.raw.chats.addChatMembers({
                chat_id: chatId,
                user_ids: userIds,
            });
        };
        this.getChatMembers = (chatId, { user_ids, ...extra } = {}) => {
            return this.raw.chats.getChatMembers({
                chat_id: chatId,
                user_ids: user_ids?.join(','),
                ...extra,
            });
        };
        this.removeChatMember = (chatId, userId) => {
            return this.raw.chats.removeChatMember({
                chat_id: chatId,
                user_id: userId,
            });
        };
        this.getUpdates = async (types = [], extra = {}) => {
            return this.raw.subscriptions.getUpdates({
                types: Array.isArray(types) ? types.join(',') : types,
                ...extra,
            });
        };
        this.getPinnedMessage = async (chatId) => {
            return this.raw.chats.getPinnedMessage({ chat_id: chatId });
        };
        this.pinMessage = async (chatId, messageId, extra) => {
            return this.raw.chats.pinMessage({
                chat_id: chatId,
                message_id: messageId,
                ...extra,
            });
        };
        this.unpinMessage = async (chatId) => {
            return this.raw.chats.unpinMessage({ chat_id: chatId });
        };
        this.sendAction = async (chatId, action) => {
            return this.raw.chats.sendAction({
                chat_id: chatId,
                action,
            });
        };
        this.leaveChat = async (chatId) => {
            return this.raw.chats.leaveChat({ chat_id: chatId });
        };
        this.uploadImage = async (options) => {
            const data = await this.upload.image(options);
            return new attachments_1.ImageAttachment(data);
        };
        this.uploadVideo = async (options) => {
            const data = await this.upload.video(options);
            return new attachments_1.VideoAttachment({ token: data.token });
        };
        this.uploadAudio = async (options) => {
            const data = await this.upload.audio(options);
            return new attachments_1.AudioAttachment({ token: data.token });
        };
        this.uploadFile = async (options) => {
            const data = await this.upload.file(options);
            return new attachments_1.FileAttachment({ token: data.token });
        };
        this.raw = new api_1.RawApi(client);
        this.upload = new upload_1.Upload(this);
    }
}
exports.Api = Api;

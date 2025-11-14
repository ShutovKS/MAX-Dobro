"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsApi = void 0;
const base_api_1 = require("../../base-api");
class ChatsApi extends base_api_1.BaseApi {
    async getAll({ ...query }) {
        return this._get('chats', {
            query,
        });
    }
    async getById({ chat_id }) {
        return this._get('chats/{chat_id}', {
            path: { chat_id },
        });
    }
    async getByLink({ chat_link }) {
        return this._get('chats/{chat_link}', {
            path: { chat_link },
        });
    }
    async edit({ chat_id, ...body }) {
        return this._patch('chats/{chat_id}', {
            path: { chat_id },
            body,
        });
    }
    async getChatMembership({ chat_id }) {
        return this._get('chats/{chat_id}/members/me', {
            path: { chat_id },
        });
    }
    async getChatAdmins({ chat_id }) {
        return this._get('chats/{chat_id}/members/admins', {
            path: { chat_id },
        });
    }
    async addChatMembers({ chat_id, ...body }) {
        return this._post('chats/{chat_id}/members', {
            path: { chat_id },
            body,
        });
    }
    async getChatMembers({ chat_id, ...query }) {
        return this._get('chats/{chat_id}/members', {
            path: { chat_id },
            query,
        });
    }
    async removeChatMember({ chat_id, ...body }) {
        return this._delete('chats/{chat_id}/members', {
            path: { chat_id },
            body,
        });
    }
    async getPinnedMessage({ chat_id }) {
        return this._get('chats/{chat_id}/pin', {
            path: { chat_id },
        });
    }
    async pinMessage({ chat_id, ...body }) {
        return this._put('chats/{chat_id}/pin', {
            path: { chat_id },
            body,
        });
    }
    async unpinMessage({ chat_id }) {
        return this._delete('chats/{chat_id}/pin', {
            path: { chat_id },
        });
    }
    async sendAction({ chat_id, ...body }) {
        return this._post('chats/{chat_id}/actions', {
            path: { chat_id },
            body,
        });
    }
    async leaveChat({ chat_id }) {
        return this._delete('chats/{chat_id}/members/me', {
            path: { chat_id },
        });
    }
}
exports.ChatsApi = ChatsApi;

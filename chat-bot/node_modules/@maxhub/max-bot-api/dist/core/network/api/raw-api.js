"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawApi = void 0;
const modules_1 = require("./modules");
class RawApi extends modules_1.BaseApi {
    constructor(client) {
        super(client);
        this.client = client;
        this.get = this._get;
        this.post = this._post;
        this.patch = this._patch;
    }
    get chats() {
        return (this._chats ?? (this._chats = new modules_1.ChatsApi(this.client)));
    }
    get bots() {
        return (this._bots ?? (this._bots = new modules_1.BotsApi(this.client)));
    }
    get messages() {
        return (this._messages ?? (this._messages = new modules_1.MessagesApi(this.client)));
    }
    get subscriptions() {
        return (this._subscriptions ?? (this._subscriptions = new modules_1.SubscriptionsApi(this.client)));
    }
    get uploads() {
        return (this._uploads ?? (this._uploads = new modules_1.UploadsApi(this.client)));
    }
}
exports.RawApi = RawApi;

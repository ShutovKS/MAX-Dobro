"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsApi = void 0;
const base_api_1 = require("../../base-api");
class SubscriptionsApi extends base_api_1.BaseApi {
    constructor() {
        super(...arguments);
        this.getUpdates = async ({ ...query }) => {
            return this._get('updates', { query });
        };
    }
}
exports.SubscriptionsApi = SubscriptionsApi;

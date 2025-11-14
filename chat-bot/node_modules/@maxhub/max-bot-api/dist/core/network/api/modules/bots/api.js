"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotsApi = void 0;
const base_api_1 = require("../../base-api");
class BotsApi extends base_api_1.BaseApi {
    constructor() {
        super(...arguments);
        this.getMyInfo = async () => {
            return this._get('me', {});
        };
        this.editMyInfo = async ({ ...body }) => {
            return this._patch('me', { body });
        };
    }
}
exports.BotsApi = BotsApi;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsApi = void 0;
const base_api_1 = require("../../base-api");
class UploadsApi extends base_api_1.BaseApi {
    constructor() {
        super(...arguments);
        this.getUploadUrl = async ({ ...query }) => {
            return this._post('uploads', { query });
        };
    }
}
exports.UploadsApi = UploadsApi;

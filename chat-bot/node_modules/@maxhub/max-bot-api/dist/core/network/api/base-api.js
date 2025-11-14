"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApi = void 0;
const error_1 = require("./error");
class BaseApi {
    constructor(client) {
        this.callApi = async (method, options) => {
            const result = await this.call({
                method,
                options,
            });
            if (result.status !== 200) {
                throw new error_1.MaxError(result.status, result.data);
            }
            return result.data;
        };
        this._get = async (method, options) => {
            return this.callApi(method, { ...options, method: 'GET' });
        };
        this._post = async (method, options) => {
            return this.callApi(method, { ...options, method: 'POST' });
        };
        this._patch = async (method, options) => {
            return this.callApi(method, { ...options, method: 'PATCH' });
        };
        this._put = async (method, options) => {
            return this.callApi(method, { ...options, method: 'PUT' });
        };
        this._delete = async (method, options) => {
            return this.callApi(method, { ...options, method: 'DELETE' });
        };
        this.call = client.call;
    }
}
exports.BaseApi = BaseApi;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxError = void 0;
class MaxError extends Error {
    constructor(status, response) {
        super(`${status}: ${response.message}`);
        this.status = status;
        this.response = response;
    }
    get code() {
        return this.response.code;
    }
    get description() {
        return this.response.message;
    }
}
exports.MaxError = MaxError;

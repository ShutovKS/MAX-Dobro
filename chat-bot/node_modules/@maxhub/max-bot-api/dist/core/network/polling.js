"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polling = void 0;
const debug_1 = __importDefault(require("debug"));
const api_1 = require("./api");
const debug = (0, debug_1.default)('one-me:polling');
const RETRY_INTERVAL = 5000; // ms
class Polling {
    constructor(api, allowedUpdates = []) {
        this.api = api;
        this.allowedUpdates = allowedUpdates;
        this.abortController = new AbortController();
        this.loop = async (handleUpdate) => {
            debug('Starting long polling');
            while (!this.abortController.signal.aborted) {
                try {
                    const { updates, marker } = await this.api.getUpdates(this.allowedUpdates, {
                        marker: this.marker,
                    });
                    this.marker = marker;
                    await Promise.all(updates.map(handleUpdate));
                }
                catch (err) {
                    if (err instanceof Error) {
                        if (err.name === 'AbortError')
                            return;
                        if (err.name === 'FetchError'
                            || (err instanceof api_1.MaxError && err.status === 429)
                            || (err instanceof api_1.MaxError && err.status >= 500)) {
                            debug(`Failed to fetch updates, retrying after ${RETRY_INTERVAL}ms.`, err);
                            await new Promise((resolve) => {
                                setTimeout(resolve, RETRY_INTERVAL);
                            });
                            return;
                        }
                    }
                    throw err;
                }
            }
            debug('Long polling is done');
        };
        this.stop = () => {
            debug('Stopping long polling');
            this.abortController.abort();
        };
    }
}
exports.Polling = Polling;

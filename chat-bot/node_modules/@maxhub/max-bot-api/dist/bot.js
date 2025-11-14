"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const debug_1 = __importDefault(require("debug"));
const composer_1 = require("./composer");
const context_1 = require("./context");
const api_1 = require("./core/network/api");
const polling_1 = require("./core/network/polling");
const api_2 = require("./api");
const debug = (0, debug_1.default)('one-me:main');
const defaultConfig = {
    contextType: context_1.Context,
};
class Bot extends composer_1.Composer {
    constructor(token, config) {
        super();
        this.pollingIsStarted = false;
        this.handleError = (err, ctx) => {
            process.exitCode = 1;
            console.error('Unhandled error while processing', ctx.update);
            throw err;
        };
        this.start = async (options) => {
            if (this.pollingIsStarted) {
                debug('Long polling already running');
                return;
            }
            this.pollingIsStarted = true;
            this.botInfo ?? (this.botInfo = await this.api.getMyInfo());
            this.polling = new polling_1.Polling(this.api, options?.allowedUpdates);
            debug(`Starting @${this.botInfo.username}`);
            await this.polling.loop(this.handleUpdate);
        };
        this.stop = () => {
            if (!this.pollingIsStarted) {
                debug('Long polling is not running');
                return;
            }
            this.polling?.stop();
            this.pollingIsStarted = false;
        };
        this.handleUpdate = async (update) => {
            const updateId = `${update.update_type}:${update.timestamp}`;
            debug(`Processing update ${updateId}`);
            const UpdateContext = this.config.contextType;
            const ctx = new UpdateContext(update, this.api, this.botInfo);
            try {
                await this.middleware()(ctx, () => Promise.resolve(undefined));
            }
            catch (err) {
                await this.handleError(err, ctx);
            }
            finally {
                debug(`Finished processing update ${updateId}`);
            }
        };
        // @ts-ignore
        this.config = { ...defaultConfig, ...config };
        this.api = new api_2.Api((0, api_1.createClient)(token, this.config.clientOptions));
        debug('Created `Bot` instance');
    }
    catch(handler) {
        this.handleError = handler;
        return this;
    }
}
exports.Bot = Bot;

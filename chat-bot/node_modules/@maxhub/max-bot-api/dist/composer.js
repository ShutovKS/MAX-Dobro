"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Composer = void 0;
const filters_1 = require("./filters");
class Composer {
    constructor(...middlewares) {
        this.handler = Composer.compose(middlewares);
    }
    middleware() {
        return this.handler;
    }
    use(...middlewares) {
        this.handler = Composer.compose([this.handler, ...middlewares]);
        return this;
    }
    on(filters, ...middlewares) {
        return this.use(this.filter(filters, ...middlewares));
    }
    command(command, ...middlewares) {
        const normalizedTriggers = normalizeTriggers(command);
        const filter = (0, filters_1.createdMessageBodyHas)('text');
        const handler = Composer.compose(middlewares);
        return this.use(this.filter(filter, (ctx, next) => {
            const text = extractTextFromMessage(ctx.message, ctx.myId);
            const cmd = text.slice(1);
            for (const trigger of normalizedTriggers) {
                const match = trigger(cmd);
                if (match) {
                    ctx.match = match;
                    return handler(ctx, next);
                }
            }
            return next();
        }));
    }
    hears(triggers, ...middlewares) {
        const normalizedTriggers = normalizeTriggers(triggers);
        const filter = (0, filters_1.createdMessageBodyHas)('text');
        const handler = Composer.compose(middlewares);
        return this.use(this.filter(filter, (ctx, next) => {
            const text = extractTextFromMessage(ctx.message, ctx.myId);
            for (const trigger of normalizedTriggers) {
                const match = trigger(text);
                if (match) {
                    ctx.match = match;
                    return handler(ctx, next);
                }
            }
            return next();
        }));
    }
    action(triggers, ...middlewares) {
        const normalizedTriggers = normalizeTriggers(triggers);
        const handler = Composer.compose(middlewares);
        return this.use(this.filter('message_callback', (ctx, next) => {
            const { payload } = ctx.update.callback;
            if (!payload)
                return next();
            for (const trigger of normalizedTriggers) {
                const match = trigger(payload);
                if (match) {
                    ctx.match = match;
                    return handler(ctx, next);
                }
            }
            return next();
        }));
    }
    filter(filters, ...middlewares) {
        const handler = Composer.compose(middlewares);
        return (ctx, next) => {
            return ctx.has(filters) ? handler(ctx, next) : next();
        };
    }
    static flatten(mw) {
        return typeof mw === 'function'
            ? mw
            : (ctx, next) => mw.middleware()(ctx, next);
    }
    static concat(first, andThen) {
        return async (ctx, next) => {
            let nextCalled = false;
            await first(ctx, async () => {
                if (nextCalled) {
                    throw new Error('`next` already called before!');
                }
                nextCalled = true;
                await andThen(ctx, next);
            });
        };
    }
    static pass(_ctx, next) {
        return next();
    }
    static compose(middlewares) {
        if (!Array.isArray(middlewares)) {
            throw new Error('Middlewares must be an array');
        }
        if (middlewares.length === 0) {
            return Composer.pass;
        }
        return middlewares.map(Composer.flatten).reduce(Composer.concat);
    }
}
exports.Composer = Composer;
const normalizeTriggers = (triggers) => {
    return (Array.isArray(triggers) ? triggers : [triggers]).map((trigger) => {
        if (trigger instanceof RegExp) {
            return (value = '') => {
                // eslint-disable-next-line no-param-reassign
                trigger.lastIndex = 0;
                return trigger.exec(value.trim());
            };
        }
        const regex = new RegExp(`^${trigger}$`);
        return (value) => regex.exec(value.trim());
    });
};
const extractTextFromMessage = (message, myId) => {
    const { text } = message.body;
    const mention = message.body.markup?.find((m) => {
        return m.type === 'user_mention';
    });
    if (mention
        && mention.from === 0
        && mention.user_id === myId) {
        return text?.slice(mention.length).trim();
    }
    return text;
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createdMessageBodyHas = void 0;
const createdMessageBodyHas = (...keys) => {
    return (update) => {
        if (update.update_type !== 'message_created')
            return false;
        for (const key of keys) {
            if (!(key in update.message.body))
                return false;
            if (update.message.body[key] === undefined)
                return false;
        }
        return true;
    };
};
exports.createdMessageBodyHas = createdMessageBodyHas;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsApi = exports.UploadsApi = exports.SubscriptionsApi = exports.MessagesApi = exports.BotsApi = exports.BaseApi = void 0;
var base_api_1 = require("../base-api");
Object.defineProperty(exports, "BaseApi", { enumerable: true, get: function () { return base_api_1.BaseApi; } });
var api_1 = require("./bots/api");
Object.defineProperty(exports, "BotsApi", { enumerable: true, get: function () { return api_1.BotsApi; } });
__exportStar(require("./bots/types"), exports);
var api_2 = require("./messages/api");
Object.defineProperty(exports, "MessagesApi", { enumerable: true, get: function () { return api_2.MessagesApi; } });
__exportStar(require("./messages/types"), exports);
var api_3 = require("./subscriptions/api");
Object.defineProperty(exports, "SubscriptionsApi", { enumerable: true, get: function () { return api_3.SubscriptionsApi; } });
__exportStar(require("./subscriptions/types"), exports);
var api_4 = require("./uploads/api");
Object.defineProperty(exports, "UploadsApi", { enumerable: true, get: function () { return api_4.UploadsApi; } });
__exportStar(require("./uploads/types"), exports);
var api_5 = require("./chats/api");
Object.defineProperty(exports, "ChatsApi", { enumerable: true, get: function () { return api_5.ChatsApi; } });
__exportStar(require("./chats/types"), exports);

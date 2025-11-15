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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxError = exports.Keyboard = exports.ShareAttachment = exports.LocationAttachment = exports.VideoAttachment = exports.StickerAttachment = exports.ImageAttachment = exports.FileAttachment = exports.AudioAttachment = exports.Context = exports.Composer = exports.Bot = exports.Api = void 0;
var api_1 = require("./api");
Object.defineProperty(exports, "Api", { enumerable: true, get: function () { return api_1.Api; } });
var bot_1 = require("./bot");
Object.defineProperty(exports, "Bot", { enumerable: true, get: function () { return bot_1.Bot; } });
var composer_1 = require("./composer");
Object.defineProperty(exports, "Composer", { enumerable: true, get: function () { return composer_1.Composer; } });
var context_1 = require("./context");
Object.defineProperty(exports, "Context", { enumerable: true, get: function () { return context_1.Context; } });
var attachments_1 = require("./core/helpers/attachments");
Object.defineProperty(exports, "AudioAttachment", { enumerable: true, get: function () { return attachments_1.AudioAttachment; } });
Object.defineProperty(exports, "FileAttachment", { enumerable: true, get: function () { return attachments_1.FileAttachment; } });
Object.defineProperty(exports, "ImageAttachment", { enumerable: true, get: function () { return attachments_1.ImageAttachment; } });
Object.defineProperty(exports, "StickerAttachment", { enumerable: true, get: function () { return attachments_1.StickerAttachment; } });
Object.defineProperty(exports, "VideoAttachment", { enumerable: true, get: function () { return attachments_1.VideoAttachment; } });
Object.defineProperty(exports, "LocationAttachment", { enumerable: true, get: function () { return attachments_1.LocationAttachment; } });
Object.defineProperty(exports, "ShareAttachment", { enumerable: true, get: function () { return attachments_1.ShareAttachment; } });
exports.Keyboard = __importStar(require("./core/helpers/keyboard"));
var api_2 = require("./core/network/api");
Object.defineProperty(exports, "MaxError", { enumerable: true, get: function () { return api_2.MaxError; } });

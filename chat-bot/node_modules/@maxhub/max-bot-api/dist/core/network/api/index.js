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
exports.RawApi = exports.MaxError = exports.createClient = void 0;
__exportStar(require("./types"), exports);
__exportStar(require("./modules/types"), exports);
var client_1 = require("./client");
Object.defineProperty(exports, "createClient", { enumerable: true, get: function () { return client_1.createClient; } });
var error_1 = require("./error");
Object.defineProperty(exports, "MaxError", { enumerable: true, get: function () { return error_1.MaxError; } });
var raw_api_1 = require("./raw-api");
Object.defineProperty(exports, "RawApi", { enumerable: true, get: function () { return raw_api_1.RawApi; } });

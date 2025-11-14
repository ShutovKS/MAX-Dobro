"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = exports.requestGeoLocation = exports.requestContact = exports.link = exports.callback = void 0;
const callback = (text, payload, extra) => {
    return {
        type: 'callback', text, payload, ...extra,
    };
};
exports.callback = callback;
const link = (text, url) => {
    return {
        type: 'link', text, url,
    };
};
exports.link = link;
const requestContact = (text) => {
    return {
        type: 'request_contact', text,
    };
};
exports.requestContact = requestContact;
const requestGeoLocation = (text, extra) => {
    return {
        type: 'request_geo_location', text, ...extra,
    };
};
exports.requestGeoLocation = requestGeoLocation;
const chat = (text, chatTitle, extra) => {
    return {
        type: 'chat', text, chat_title: chatTitle, ...extra,
    };
};
exports.chat = chat;

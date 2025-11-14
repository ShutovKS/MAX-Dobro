import type { Client } from './client';
import { BaseApi, BotsApi, ChatsApi, MessagesApi, SubscriptionsApi, UploadsApi } from './modules';
export declare class RawApi extends BaseApi {
    private readonly client;
    constructor(client: Client);
    get: <Method extends "chats" | "chats/{chat_id}" | "chats/{chat_id}/members/admins" | "chats/{chat_id}/members" | "chats/{chat_id}/members/me" | "chats/{chat_id}/pin" | "chats/{chat_link}" | "me" | "updates" | "messages" | "messages/{message_id}">(method: Method, options: {
        chats: {
            req: import("./modules").GetAllChatsDTO;
            res: import("./modules").GetAllChatsResponse;
        };
        'chats/{chat_id}': {
            req: import("./modules").GetChatByIdDTO;
            res: import("./modules").GetChatByIdResponse;
        };
        'chats/{chat_id}/members/admins': {
            req: import("./modules").GetChatAdminsDTO;
            res: import("./modules").GetChatAdminsResponse;
        };
        'chats/{chat_id}/members': {
            req: import("./modules").GetChatMembersDTO;
            res: import("./modules").GetChatMembersResponse;
        };
        'chats/{chat_id}/members/me': {
            req: import("./modules").GetChatMembershipDTO;
            res: import("./modules").GetChatMembershipResponse;
        };
        'chats/{chat_id}/pin': {
            req: import("./modules").GetPinnedMessageDTO;
            res: import("./modules").GetPinnedMessageResponse;
        };
        'chats/{chat_link}': {
            req: import("./modules").GetChatByLinkDTO;
            res: import("./modules").GetChatByLinkResponse;
        };
        me: {
            req: {};
            res: import("./modules").GetMyInfoResponse;
        };
        updates: {
            req: import("./modules").GetUpdatesDTO;
            res: import("./modules").GetUpdatesResponse;
        };
        messages: {
            req: import("./modules").GetMessagesDTO;
            res: import("./modules").GetMessagesResponse;
        };
        'messages/{message_id}': {
            req: import("./modules").GetMessageDTO;
            res: import("./modules").GetMessageResponse;
        };
    }[Method]["req"]) => Promise<{
        chats: {
            req: import("./modules").GetAllChatsDTO;
            res: import("./modules").GetAllChatsResponse;
        };
        'chats/{chat_id}': {
            req: import("./modules").GetChatByIdDTO;
            res: import("./modules").GetChatByIdResponse;
        };
        'chats/{chat_id}/members/admins': {
            req: import("./modules").GetChatAdminsDTO;
            res: import("./modules").GetChatAdminsResponse;
        };
        'chats/{chat_id}/members': {
            req: import("./modules").GetChatMembersDTO;
            res: import("./modules").GetChatMembersResponse;
        };
        'chats/{chat_id}/members/me': {
            req: import("./modules").GetChatMembershipDTO;
            res: import("./modules").GetChatMembershipResponse;
        };
        'chats/{chat_id}/pin': {
            req: import("./modules").GetPinnedMessageDTO;
            res: import("./modules").GetPinnedMessageResponse;
        };
        'chats/{chat_link}': {
            req: import("./modules").GetChatByLinkDTO;
            res: import("./modules").GetChatByLinkResponse;
        };
        me: {
            req: {};
            res: import("./modules").GetMyInfoResponse;
        };
        updates: {
            req: import("./modules").GetUpdatesDTO;
            res: import("./modules").GetUpdatesResponse;
        };
        messages: {
            req: import("./modules").GetMessagesDTO;
            res: import("./modules").GetMessagesResponse;
        };
        'messages/{message_id}': {
            req: import("./modules").GetMessageDTO;
            res: import("./modules").GetMessageResponse;
        };
    }[Method]["res"]>;
    post: <Method extends "chats/{chat_id}/members" | "messages" | "chats/{chat_id}/actions" | "uploads" | "answers">(method: Method, options: {
        'chats/{chat_id}/actions': {
            req: import("./modules").SendActionDTO;
            res: import("./modules").SendActionResponse;
        };
        'chats/{chat_id}/members': {
            req: import("./modules").AddChatMembersDTO;
            res: import("./modules").AddChatMembersResponse;
        };
        messages: {
            req: import("./modules").SendMessageDTO;
            res: import("./modules").SendMessageResponse;
        };
        uploads: {
            req: import("./modules").GetUploadUrlDTO;
            res: import("./modules").GetUploadUrlResponse;
        };
        answers: {
            req: import("./modules").AnswerOnCallbackDTO;
            res: import("./modules").AnswerOnCallbackResponse;
        };
    }[Method]["req"]) => Promise<{
        'chats/{chat_id}/actions': {
            req: import("./modules").SendActionDTO;
            res: import("./modules").SendActionResponse;
        };
        'chats/{chat_id}/members': {
            req: import("./modules").AddChatMembersDTO;
            res: import("./modules").AddChatMembersResponse;
        };
        messages: {
            req: import("./modules").SendMessageDTO;
            res: import("./modules").SendMessageResponse;
        };
        uploads: {
            req: import("./modules").GetUploadUrlDTO;
            res: import("./modules").GetUploadUrlResponse;
        };
        answers: {
            req: import("./modules").AnswerOnCallbackDTO;
            res: import("./modules").AnswerOnCallbackResponse;
        };
    }[Method]["res"]>;
    patch: <Method extends "chats/{chat_id}" | "me">(method: Method, options: {
        me: {
            req: import("./modules").EditMyInfoDTO;
            res: import("./modules").EditMyInfoResponse;
        };
        'chats/{chat_id}': {
            req: import("./modules").EditChatInfoDTO;
            res: import("./modules").EditChatInfoResponse;
        };
    }[Method]["req"]) => Promise<{
        me: {
            req: import("./modules").EditMyInfoDTO;
            res: import("./modules").EditMyInfoResponse;
        };
        'chats/{chat_id}': {
            req: import("./modules").EditChatInfoDTO;
            res: import("./modules").EditChatInfoResponse;
        };
    }[Method]["res"]>;
    private _chats?;
    get chats(): ChatsApi;
    private _bots?;
    get bots(): BotsApi;
    private _messages?;
    get messages(): MessagesApi;
    private _subscriptions?;
    get subscriptions(): SubscriptionsApi;
    private _uploads?;
    get uploads(): UploadsApi;
}

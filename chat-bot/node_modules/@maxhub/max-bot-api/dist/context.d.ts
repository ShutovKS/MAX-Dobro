import type { Guard, Guarded, MaybeArray } from './core/helpers/types';
import type { AnswerOnCallbackExtra, BotInfo, BotStartedUpdate, Chat, EditMessageExtra, FilteredUpdate, GetMessagesExtra, Message, MessageCallbackUpdate, SenderAction, SendMessageExtra, Update, UpdateType, User } from './core/network/api';
import { type Api } from './api';
import { EditChatExtra, GetAllChatsExtra, GetChatMembersExtra, PinMessageExtra } from './core/network/api/modules';
export type FilteredContext<Ctx extends Context, Filter extends UpdateType | Guard<Ctx['update']>> = Filter extends UpdateType ? Ctx & Context<FilteredUpdate<Filter>> : Ctx & Context<Guarded<Filter>>;
type GetMessage<U extends Update> = U extends MessageCallbackUpdate ? MessageCallbackUpdate['message'] : U extends {
    message: Message;
} ? Message : undefined;
type GetChatId<U extends Update> = U extends {
    chat_id: number;
} ? number : U extends MessageCallbackUpdate ? number | undefined : U extends {
    message: Message;
} ? number : undefined;
type GetChat<U extends Update> = U extends {
    chat: Chat;
} ? Chat : undefined;
type GetMsgId<U extends Update> = U extends {
    message_id: string;
} ? string : U extends MessageCallbackUpdate ? string | undefined : U extends {
    message: Message;
} ? string : undefined;
type GetCallback<U extends Update> = U extends MessageCallbackUpdate ? MessageCallbackUpdate['callback'] : undefined;
type GetUser<U extends Update> = U extends {
    user: User;
} ? User : U extends MessageCallbackUpdate ? User : undefined;
type GetStartPayload<U extends Update> = U extends BotStartedUpdate ? string | undefined | null : undefined;
type ContactInfo = {
    tel?: string;
    fullName?: string;
};
type Location = {
    latitude: number;
    longitude: number;
};
type Sticker = {
    width: number;
    height: number;
    url: string;
    code: string;
};
export declare class Context<U extends Update = Update> {
    readonly update: U;
    readonly api: Api;
    readonly botInfo?: BotInfo | undefined;
    match?: RegExpExecArray;
    constructor(update: U, api: Api, botInfo?: BotInfo | undefined);
    has<Ctx extends Context, Filter extends UpdateType | Guard<Ctx['update']>>(this: Ctx, filters: MaybeArray<Filter>): this is FilteredContext<Ctx, Filter>;
    assert<T extends string | number | object>(value: T | undefined, method: string): asserts value is T;
    get updateType(): "message_callback" | "message_created" | "message_removed" | "message_edited" | "bot_added" | "bot_removed" | "user_added" | "user_removed" | "bot_started" | "chat_title_changed" | "message_construction_request" | "message_constructed" | "message_chat_created";
    get myId(): number | undefined;
    get startPayload(): GetStartPayload<U>;
    get chat(): GetChat<U>;
    get chatId(): GetChatId<U>;
    get message(): GetMessage<U>;
    get messageId(): GetMsgId<U>;
    get callback(): GetCallback<U>;
    get user(): GetUser<U>;
    private _contactInfo?;
    get contactInfo(): ContactInfo | undefined;
    private _location?;
    get location(): Location | undefined;
    private _sticker?;
    get sticker(): Sticker | undefined;
    reply(text: string, extra?: SendMessageExtra): Promise<Message>;
    getAllChats(extra?: GetAllChatsExtra): Promise<import("./core/network/api/modules").GetAllChatsResponse>;
    getChat(chatId?: number): Promise<Chat>;
    getChatByLink(link: string): Promise<Chat>;
    editChatInfo(extra: EditChatExtra): Promise<Chat>;
    getMessage(id: string): Promise<Message>;
    getMessages(extra?: GetMessagesExtra): Promise<import("./core/network/api").GetMessagesResponse>;
    getPinnedMessage(): Promise<import("./core/network/api/modules").GetPinnedMessageResponse>;
    editMessage(extra: EditMessageExtra): Promise<import("./core/network/api").ActionResponse>;
    deleteMessage(messageId?: string): Promise<import("./core/network/api").ActionResponse>;
    answerOnCallback(extra: AnswerOnCallbackExtra): Promise<import("./core/network/api").ActionResponse>;
    getChatMembership(): Promise<import("./core/network/api").ChatMember>;
    getChatAdmins(): Promise<import("./core/network/api/modules").GetChatAdminsResponse>;
    addChatMembers(userIds: number[]): Promise<import("./core/network/api").ActionResponse>;
    getChatMembers(extra?: GetChatMembersExtra): Promise<import("./core/network/api/modules").GetChatMembersResponse>;
    removeChatMember(userId: number): Promise<import("./core/network/api").ActionResponse>;
    pinMessage(messageId: string, extra?: PinMessageExtra): Promise<import("./core/network/api").ActionResponse>;
    unpinMessage(): Promise<import("./core/network/api").ActionResponse>;
    sendAction(action: SenderAction): Promise<import("./core/network/api").ActionResponse>;
    leaveChat(): Promise<import("./core/network/api").ActionResponse>;
}
export {};

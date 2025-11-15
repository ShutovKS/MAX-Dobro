import { BaseApi } from '../../base-api';
import type { FlattenReq, GetMessageDTO, GetMessageResponse, GetMessagesDTO, GetMessagesResponse, SendMessageResponse } from '../types';
import type { SendMessageDTO, DeleteMessageDTO } from './types';
export declare class MessagesApi extends BaseApi {
    get: ({ ...query }: FlattenReq<GetMessagesDTO>) => Promise<GetMessagesResponse>;
    getById: ({ message_id }: FlattenReq<GetMessageDTO>) => Promise<GetMessageResponse>;
    send: ({ chat_id, user_id, disable_link_preview, ...body }: FlattenReq<SendMessageDTO>) => Promise<SendMessageResponse>;
    edit: ({ message_id, ...body }: {
        [x: string]: any;
        message_id: any;
    }) => Promise<import("../..").ActionResponse>;
    delete: ({ ...query }: FlattenReq<DeleteMessageDTO>) => Promise<import("../..").ActionResponse>;
    answerOnCallback: ({ callback_id, ...body }: {
        [x: string]: any;
        callback_id: any;
    }) => Promise<import("../..").ActionResponse>;
}

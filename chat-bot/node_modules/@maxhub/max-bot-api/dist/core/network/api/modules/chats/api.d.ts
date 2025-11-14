import { BaseApi } from '../../base-api';
import type { FlattenReq } from '../types';
import type { AddChatMembersDTO, AddChatMembersResponse, EditChatInfoDTO, EditChatInfoResponse, GetAllChatsDTO, GetAllChatsResponse, GetChatAdminsDTO, GetChatAdminsResponse, GetChatByIdDTO, GetChatByIdResponse, GetChatByLinkDTO, GetChatByLinkResponse, GetChatMembersDTO, GetChatMembershipDTO, GetChatMembershipResponse, GetChatMembersResponse, GetPinnedMessageDTO, GetPinnedMessageResponse, LeaveChatDTO, LeaveChatResponse, PinMessageDTO, PinMessageResponse, RemoveChatMemberDTO, RemoveChatMemberResponse, SendActionDTO, SendActionResponse, UnpinMessageDTO, UnpinMessageResponse } from './types';
export declare class ChatsApi extends BaseApi {
    getAll({ ...query }: FlattenReq<GetAllChatsDTO>): Promise<GetAllChatsResponse>;
    getById({ chat_id }: FlattenReq<GetChatByIdDTO>): Promise<GetChatByIdResponse>;
    getByLink({ chat_link }: FlattenReq<GetChatByLinkDTO>): Promise<GetChatByLinkResponse>;
    edit({ chat_id, ...body }: FlattenReq<EditChatInfoDTO>): Promise<EditChatInfoResponse>;
    getChatMembership({ chat_id }: FlattenReq<GetChatMembershipDTO>): Promise<GetChatMembershipResponse>;
    getChatAdmins({ chat_id }: FlattenReq<GetChatAdminsDTO>): Promise<GetChatAdminsResponse>;
    addChatMembers({ chat_id, ...body }: FlattenReq<AddChatMembersDTO>): Promise<AddChatMembersResponse>;
    getChatMembers({ chat_id, ...query }: FlattenReq<GetChatMembersDTO>): Promise<GetChatMembersResponse>;
    removeChatMember({ chat_id, ...body }: FlattenReq<RemoveChatMemberDTO>): Promise<RemoveChatMemberResponse>;
    getPinnedMessage({ chat_id }: FlattenReq<GetPinnedMessageDTO>): Promise<GetPinnedMessageResponse>;
    pinMessage({ chat_id, ...body }: FlattenReq<PinMessageDTO>): Promise<PinMessageResponse>;
    unpinMessage({ chat_id }: FlattenReq<UnpinMessageDTO>): Promise<UnpinMessageResponse>;
    sendAction({ chat_id, ...body }: FlattenReq<SendActionDTO>): Promise<SendActionResponse>;
    leaveChat({ chat_id }: FlattenReq<LeaveChatDTO>): Promise<LeaveChatResponse>;
}

import { BaseApi } from '../../base-api';
import type { FlattenReq } from '../types';
import type { EditMyInfoDTO } from './types';
export declare class BotsApi extends BaseApi {
    getMyInfo: () => Promise<import("../..").BotInfo>;
    editMyInfo: ({ ...body }: FlattenReq<EditMyInfoDTO>) => Promise<import("../..").BotInfo>;
}

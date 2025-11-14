import { BaseApi } from '../../base-api';
import { FlattenReq } from '../types';
import { GetUpdatesDTO } from './types';
export declare class SubscriptionsApi extends BaseApi {
    getUpdates: ({ ...query }: FlattenReq<GetUpdatesDTO>) => Promise<import("./types").GetUpdatesResponse>;
}

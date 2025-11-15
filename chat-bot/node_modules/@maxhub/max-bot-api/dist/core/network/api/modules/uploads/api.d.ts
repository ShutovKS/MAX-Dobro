import { BaseApi } from '../../base-api';
import { FlattenReq } from '../types';
import { GetUploadUrlDTO } from './types';
export declare class UploadsApi extends BaseApi {
    getUploadUrl: ({ ...query }: FlattenReq<GetUploadUrlDTO>) => Promise<import("./types").GetUploadUrlResponse>;
}

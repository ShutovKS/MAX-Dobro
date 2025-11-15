import type { Client } from './client';
import type { ApiMethods } from './modules/types';
type ApiCallFn<HTTPMethod extends keyof ApiMethods> = <Method extends keyof ApiMethods[HTTPMethod]>(method: Method, options: ApiMethods[HTTPMethod][Method]['req']) => Promise<ApiMethods[HTTPMethod][Method]['res']>;
export declare class BaseApi {
    private readonly call;
    constructor(client: Client);
    private callApi;
    protected _get: ApiCallFn<'GET'>;
    protected _post: ApiCallFn<'POST'>;
    protected _patch: ApiCallFn<'PATCH'>;
    protected _put: ApiCallFn<'PUT'>;
    protected _delete: ApiCallFn<'DELETE'>;
}
export {};

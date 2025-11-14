import type { MessageBody, MessageCreatedUpdate, Update } from './core/network/api';
export declare const createdMessageBodyHas: <Keys extends Array<keyof MessageBody>>(...keys: Keys) => (update: Update) => update is MessageCreatedUpdate;

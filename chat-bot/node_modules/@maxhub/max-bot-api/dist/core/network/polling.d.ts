import type { Api } from '../../api';
import { Update, UpdateType } from './api';
export declare class Polling {
    private readonly api;
    private readonly allowedUpdates;
    private readonly abortController;
    private marker?;
    constructor(api: Api, allowedUpdates?: UpdateType[]);
    loop: (handleUpdate: (updates: Update) => Promise<void>) => Promise<void>;
    stop: () => void;
}

import { Composer } from './composer';
import { Context } from './context';
import { MaybePromise } from './core/helpers/types';
import { BotInfo, ClientOptions, UpdateType } from './core/network/api';
import { Api } from './api';
type BotConfig<Ctx extends Context> = {
    clientOptions?: ClientOptions;
    contextType: new (...args: ConstructorParameters<typeof Context>) => Ctx;
};
type LaunchOptions = {
    allowedUpdates: UpdateType[];
};
export declare class Bot<Ctx extends Context = Context> extends Composer<Ctx> {
    api: Api;
    botInfo?: BotInfo;
    private polling?;
    private pollingIsStarted;
    private config;
    constructor(token: string, config?: Partial<BotConfig<Ctx>>);
    private handleError;
    catch(handler: (err: unknown, ctx: Ctx) => MaybePromise<void>): this;
    start: (options?: LaunchOptions) => Promise<void>;
    stop: () => void;
    private handleUpdate;
}
export {};

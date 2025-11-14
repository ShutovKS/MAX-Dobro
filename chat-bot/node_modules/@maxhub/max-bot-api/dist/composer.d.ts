import type { Guard, MaybeArray } from './core/helpers/types';
import type { UpdateType } from './core/network/api';
import type { Middleware, MiddlewareFn, MiddlewareObj, NextFn } from './middleware';
import { Context, type FilteredContext } from './context';
type Triggers = MaybeArray<string | RegExp>;
type UpdateFilter<Ctx extends Context> = UpdateType | Guard<Ctx['update']>;
export declare class Composer<Ctx extends Context> implements MiddlewareObj<Ctx> {
    private handler;
    constructor(...middlewares: Array<Middleware<Ctx>>);
    middleware(): MiddlewareFn<Ctx>;
    use(...middlewares: Array<Middleware<Ctx>>): this;
    on<Filter extends UpdateType | Guard<Ctx['update']>>(filters: MaybeArray<Filter>, ...middlewares: Array<Middleware<FilteredContext<Ctx, Filter>>>): this;
    command(command: Triggers, ...middlewares: Array<Middleware<FilteredContext<Ctx, 'message_created'>>>): this;
    hears(triggers: Triggers, ...middlewares: Array<Middleware<FilteredContext<Ctx, 'message_created'>>>): this;
    action(triggers: Triggers, ...middlewares: Array<Middleware<FilteredContext<Ctx, 'message_callback'>>>): this;
    filter<Filter extends UpdateFilter<Ctx>>(filters: MaybeArray<Filter>, ...middlewares: Array<Middleware<FilteredContext<Ctx, Filter>>>): MiddlewareFn<Ctx>;
    static flatten<C extends Context>(mw: Middleware<C>): MiddlewareFn<C>;
    static concat<C extends Context>(first: MiddlewareFn<C>, andThen: MiddlewareFn<C>): MiddlewareFn<C>;
    static pass<C extends Context>(_ctx: C, next: NextFn): Promise<void>;
    static compose<C extends Context>(middlewares: Array<Middleware<C>>): MiddlewareFn<C>;
}
export {};

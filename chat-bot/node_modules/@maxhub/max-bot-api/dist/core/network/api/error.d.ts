export type ErrorResponse = {
    code: string;
    message: string;
};
export declare class MaxError extends Error {
    readonly status: number;
    private readonly response;
    constructor(status: number, response: ErrorResponse);
    get code(): string;
    get description(): string;
}

import * as fs from 'fs';
import { type Api } from '../../api';
type FileSource = string | fs.ReadStream | Buffer;
type DefaultOptions = {
    timeout?: number;
};
type UploadFromSourceOptions = {
    source: FileSource;
};
type UploadFromUrlOptions = {
    url: string;
};
type UploadFromUrlOrSourceOptions = UploadFromSourceOptions | UploadFromUrlOptions;
export type UploadImageOptions = UploadFromUrlOrSourceOptions & DefaultOptions;
export type UploadVideoOptions = UploadFromSourceOptions & DefaultOptions;
export type UploadFileOptions = UploadFromSourceOptions & DefaultOptions;
export type UploadAudioOptions = UploadFromSourceOptions & DefaultOptions;
export declare class Upload {
    private readonly api;
    constructor(api: Api);
    private getStreamFromSource;
    private upload;
    private uploadFromStream;
    private uploadFromBuffer;
    image: ({ timeout, ...source }: UploadImageOptions) => Promise<{
        photos: {
            [key: string]: {
                token: string;
            };
        };
    } | {
        url: string;
    }>;
    video: ({ source, ...options }: UploadVideoOptions) => Promise<{
        id: number;
        token: string;
    }>;
    file: ({ source, ...options }: UploadFileOptions) => Promise<{
        id: number;
        token: string;
    }>;
    audio: ({ source, ...options }: UploadAudioOptions) => Promise<{
        id: number;
        token: string;
    }>;
}
export {};

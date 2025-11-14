import { AudioAttachmentRequest, FileAttachmentRequest, ImageAttachmentRequest, LocationAttachmentRequest, ShareAttachmentRequest, StickerAttachmentRequest, VideoAttachmentRequest } from '../network/api';
declare class Attachment {
    toJson(): void;
}
export declare class MediaAttachment extends Attachment {
    readonly token?: string;
    constructor({ token }: {
        token?: string;
    });
    get payload(): object;
}
export declare class VideoAttachment extends MediaAttachment {
    readonly type = "video";
    toJson(): VideoAttachmentRequest;
}
export type ImagePhotos = {
    [key: string]: {
        token: string;
    };
};
export declare class ImageAttachment extends MediaAttachment {
    readonly photos?: ImagePhotos;
    readonly url?: string;
    constructor(options: {
        token?: string;
    } | {
        photos?: ImagePhotos;
    } | {
        url?: string;
    });
    get payload(): ImageAttachmentRequest['payload'];
    toJson(): ImageAttachmentRequest;
}
export declare class AudioAttachment extends MediaAttachment {
    toJson(): AudioAttachmentRequest;
}
export declare class FileAttachment extends MediaAttachment {
    toJson(): FileAttachmentRequest;
}
export declare class StickerAttachment extends Attachment {
    readonly code: string;
    constructor({ code }: {
        code: string;
    });
    get payload(): StickerAttachmentRequest['payload'];
    toJson(): StickerAttachmentRequest;
}
export declare class LocationAttachment extends Attachment {
    readonly longitude: number;
    readonly latitude: number;
    constructor({ lon, lat }: {
        lon: number;
        lat: number;
    });
    toJson(): LocationAttachmentRequest;
}
export declare class ShareAttachment extends Attachment {
    readonly url?: string;
    readonly token?: string;
    constructor({ url, token }?: {
        url?: string;
        token?: string;
    });
    get payload(): {
        url: string | undefined;
        token: string | undefined;
    };
    toJson(): ShareAttachmentRequest;
}
export {};

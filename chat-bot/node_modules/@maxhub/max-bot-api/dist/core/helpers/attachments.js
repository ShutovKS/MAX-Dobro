"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareAttachment = exports.LocationAttachment = exports.StickerAttachment = exports.FileAttachment = exports.AudioAttachment = exports.ImageAttachment = exports.VideoAttachment = exports.MediaAttachment = void 0;
class Attachment {
    toJson() {
        throw new Error('Attachment not implemented.');
    }
}
class MediaAttachment extends Attachment {
    constructor({ token }) {
        super();
        this.token = token;
    }
    get payload() {
        return { token: this.token };
    }
}
exports.MediaAttachment = MediaAttachment;
class VideoAttachment extends MediaAttachment {
    constructor() {
        super(...arguments);
        this.type = 'video';
    }
    toJson() {
        return {
            type: this.type,
            payload: this.payload,
        };
    }
}
exports.VideoAttachment = VideoAttachment;
class ImageAttachment extends MediaAttachment {
    constructor(options) {
        super({ token: 'token' in options ? options.token : undefined });
        if ('photos' in options) {
            this.photos = options.photos;
        }
        if ('url' in options) {
            this.url = options.url;
        }
    }
    get payload() {
        if (this.token) {
            return { token: this.token };
        }
        if (this.url) {
            return { url: this.url };
        }
        return { photos: this.photos };
    }
    toJson() {
        return {
            type: 'image',
            payload: this.payload,
        };
    }
}
exports.ImageAttachment = ImageAttachment;
class AudioAttachment extends MediaAttachment {
    toJson() {
        return {
            type: 'audio',
            payload: this.payload,
        };
    }
}
exports.AudioAttachment = AudioAttachment;
class FileAttachment extends MediaAttachment {
    toJson() {
        return {
            type: 'file',
            payload: this.payload,
        };
    }
}
exports.FileAttachment = FileAttachment;
class StickerAttachment extends Attachment {
    constructor({ code }) {
        super();
        this.code = code;
    }
    get payload() {
        return { code: this.code };
    }
    toJson() {
        return {
            type: 'sticker',
            payload: this.payload,
        };
    }
}
exports.StickerAttachment = StickerAttachment;
class LocationAttachment extends Attachment {
    constructor({ lon, lat }) {
        super();
        this.longitude = lon;
        this.latitude = lat;
    }
    toJson() {
        return {
            type: 'location',
            latitude: this.latitude,
            longitude: this.longitude,
        };
    }
}
exports.LocationAttachment = LocationAttachment;
class ShareAttachment extends Attachment {
    constructor({ url, token } = {}) {
        super();
        this.url = url;
        this.token = token;
    }
    get payload() {
        return {
            url: this.url,
            token: this.token,
        };
    }
    toJson() {
        return {
            type: 'share',
            payload: this.payload,
        };
    }
}
exports.ShareAttachment = ShareAttachment;

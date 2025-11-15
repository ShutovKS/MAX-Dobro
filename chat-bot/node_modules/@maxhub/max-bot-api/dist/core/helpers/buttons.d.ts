import { Button, CallbackButton, ChatButton, LinkButton, RequestContactButton, RequestGeoLocationButton } from '../network/api';
type MakeExtra<T extends Button, O extends keyof Omit<T, 'text' | 'type'> | '' = ''> = Omit<T, 'text' | 'type' | O>;
export declare const callback: (text: string, payload: string, extra?: MakeExtra<CallbackButton, "payload">) => CallbackButton;
export declare const link: (text: string, url: string) => LinkButton;
export declare const requestContact: (text: string) => RequestContactButton;
export declare const requestGeoLocation: (text: string, extra?: MakeExtra<RequestGeoLocationButton>) => RequestGeoLocationButton;
export declare const chat: (text: string, chatTitle: string, extra?: MakeExtra<ChatButton, "chat_title">) => ChatButton;
export {};

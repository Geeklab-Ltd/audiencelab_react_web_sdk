import React from 'react';

declare const initializeAudiencelab: (apiKey: string) => Promise<{
    token: any;
    metrics: any;
}>;
declare const sendCustomPurchaseEvent: (id: string, name: string, value: number, currency: string, status: string) => Promise<any>;
declare const sendCustomAdEvent: (adId: string, name: string, source: string, watchTime: number, reward: boolean, mediaSource: string, channel: string, value: number, currency: string) => Promise<any>;

/** @jsx React.createElement */

declare const DebugConsole: () => React.JSX.Element;

interface CustomPurchaseEvent {
    item_id: string;
    item_name: string;
    value: number;
    currency: string;
    status: string;
}
interface CustomAdEvent {
    ad_id: string;
    name: string;
    source: string;
    watch_time: number;
    reward: boolean;
    media_source: string;
    channel: string;
    value: number;
    currency: string;
}

export { type CustomAdEvent, type CustomPurchaseEvent, DebugConsole, initializeAudiencelab, sendCustomAdEvent, sendCustomPurchaseEvent };

export type Item = {
    link: string;
    img: string;
    title: string;
    description: string;
    pubDate: number;
    channelTitle?: string;
    category?: string[] | string;
    channel_id: number;
    // 'content:encoded': string;
    // guid: string;
}
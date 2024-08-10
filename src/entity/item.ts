export type Item = {
    link: string;
    img: string;
    title: string;
    description: string;
    pubDate: number;
    channelTitle?: string;
    category?: string[] | string;
    // 'content:encoded': string;
    // guid: string;
}
import appConfig from "./appConfig";
import { Storage } from "./storages/storage";

// export type RSSItem = {
//     category: string[]|string;
//     description: string;
//     link: string;
//     pubDate: string;
//     title: string;
//     'content:encoded': string;
//     guid: string;
//     channelTitle?: string;
// }

// export type RSSChannel = {
//     copyright?: string;
//     description: string;
//     docs: string;
//     generator?: string;
//     image: {
//         link: string;
//         title: string;
//         url: string;
//     }
//     language: string;
//     lastBuildDate: string;
//     link: string;
//     pubDate: string;
//     title: string;
//     item: RSSItem[];
// }
  
// export type RSSData = {
//     channel: RSSChannel;
//     url: string;
//     lastFetchDate: number;
// }
  
// export type XMLData = {
//     rss: RSSData;
// }

export type Provider = {
    id: string;
    name: string;
    url: string;
    subscribed: boolean;
}

export class DataCollection<T> {
    private stack: Map<string, T> = new Map();
    readonly storage: Storage;

    constructor(storageName: string) {
        this.storage = new Storage(storageName);
    }
    
    getStack(): Map<string, T> {
        return this.stack;
    }

    marshal(stack: Map<string, T>): string {
        return JSON.stringify(Object.fromEntries(stack));
    }

    unmarshal(data: string): Map<string, T> {
        if (!data) {
            return new Map()
        }
        return new Map(Object.entries(JSON.parse(data)));
    }

    get(k: string): T | undefined {
        return this.stack.get(k);
    }
    
    set(k: string, data: T) {
        this.stack.set(k, data);
    }

    delete(k: string) {
        this.stack.delete(k);
    }

    reset(stack: Map<string, T>) {
        this.stack = stack;
    }

    // select retrieves a specific key, from the "rss" entry, in DB.
    // This does not overwrite the local this.stack
    async select(k: string): Promise<T | undefined> {
        const stack = await this.select_all();
        return stack.get(k);
    }

    // select_all retrieves the complete map, from the "rss" entry, in DB.
    // This does not overwrite the local this.stack
    async select_all(): Promise<Map<string, T>> {
        const data = await this.storage.select();
        if (!data) {
            return new Map();
        }
        return this.unmarshal(data);
    }

    // insert write on a specific key of the "rss" entry, in DB.
    // This does not overwrite the local this.stack 
    async insert(k: string, data: T): Promise<void> {
        if (!k || !data) {
            return;
        }
        const stack = await this.select_all();
        stack.set(k, data);
        return this.insert_all(stack);
    }

    // insert_all overwrite the whole map of the "rss" entry, in DB.
    // This does not overwrite the local this.stack 
    async insert_all(data: Map<string, T>): Promise<void> {
        return this.storage.insert(this.marshal(data));
    }

    // write will overwrite the whole map of the "rss" entry, in DB
    // using the local this.stack
    async write(): Promise<void> {
        return this.insert_all(this.stack);
    }

    // update overwrites the local this.stack using the map
    // stored at the "rss" entry, from DB.
    async update(): Promise<this> {
        this.stack = await this.select_all();
        return this;
    }

    async delete_all(): Promise<void> {
        await this.storage.delete();
    }
}

// export const newRSSDataCollection = (): DataCollection<RSSData> => new DataCollection<RSSData>(appConfig.storageKeys.rss);
export const newProviderDataCollection = (): DataCollection<Provider> => new DataCollection<Provider>(appConfig.storageKeys.providers_list);
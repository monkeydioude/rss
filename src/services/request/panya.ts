// import { RSSChannel, RSSItem } from "src/data_struct";
import { Channel } from "src/entity/channel";
import { Item } from "src/entity/item";
import appConfig from "../../appConfig";
import { log } from "../logchest";

export const get_feed = async (ids: number[]): Promise<Item[]> => {
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), appConfig.requestTimeout);
    try {
        const res = (await fetch(`${appConfig.panyaAPIURL}/feed?ids=${ids.join(",")}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: ctrl.signal,
        })).json();
        return res;
    } catch (err) {
        log(`Could not get feed channel: ${err}`);
        console.error("Could not get feed channel");
    } finally {
        clearTimeout(timeoutId);
    }
    return [];
}

export const add_channel = async (url: string): Promise<Channel | null> => {
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), appConfig.requestTimeout);
    try {
        const res = (await fetch(`${appConfig.panyaAPIURL}/channel`, {
            body: JSON.stringify({
                'channel_name': url,
            }),
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: ctrl.signal,
        })).json();
        return res;
    } catch (err) {
        log(`Could not add channel: ${err}`);
        console.error("Could not add channel", err);
    } finally {
        clearTimeout(timeoutId);
    }
    return null;
}
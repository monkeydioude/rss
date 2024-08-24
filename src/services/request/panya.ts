import { Channel } from "src/entity/channel";
import { Item } from "src/entity/item";
import { ConfigState } from "src/global_states/config";
import appConfig from "../../appConfig";
import { make_feed_url } from "../feed_builder";
import { Mapp } from "../map/mapp";
import { log } from "./logchest";

export const add_feed_source = async (url: string): Promise<Channel | null> => {
    try {
        const channel = await add_channel(url);
        if (!channel) {
            throw "no channel in response";
        }
        if (!channel.channel_id) {
            throw "missing channel_id";
        }
        channel.is_sub = true;
        // channel.limit = appConfig.maxItemPerFeed;
        return channel;
    } catch (err) {
        log(`add_feed_source: Could not add feed source ${url}: ${err}`);
        console.error(`Could not add feed source ${url}`, err);
    }
    return null;
}

export const get_feed = async (
    channels: Mapp<number, Channel>,
    config?: ConfigState
): Promise<Item[]> => {
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), appConfig.requestTimeout);
    try {
        const res = await (await fetch(make_feed_url(channels, config), {
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
        console.error("Could not get feed channel", err);
    } finally {
        clearTimeout(timeoutId);
    }
    return [];
}

export const add_channel = async (url: string): Promise<Channel | null> => {
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), appConfig.requestTimeout);
    try {
        const res: Channel = await (await fetch(`${appConfig.panyaAPIURL}/channel`, {
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
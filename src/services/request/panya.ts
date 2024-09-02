import { Channel } from "src/entity/channel";
import { Item } from "src/entity/item";
import { ConfigState } from "src/global_states/config";
import appConfig from "../../appConfig";
import { make_feed_url } from "../feed_builder";
import { Mapp } from "../map/mapp";
import { add_scheme } from "../normalization/url";
import { log } from "./logchest";

export enum TypeErrorEnum {
    NetworkRequestFailed = "Network request failed",
    Unknown = "Unknown error"
}

type PanyaErrors = TypeErrorEnum | null;

const handleError = (typeErr: TypeError): PanyaErrors => {
    switch (typeErr.message) {
        case TypeErrorEnum.NetworkRequestFailed:
            return TypeErrorEnum.NetworkRequestFailed;
    }
    return TypeErrorEnum.Unknown;
}


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
): Promise<[Item[], PanyaErrors]> => {
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), appConfig.requestTimeout);
    try {
        const res = await fetch(make_feed_url(channels, config), {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: ctrl.signal,
        });
        const feed = await res.json();
        return [feed, null];
    } catch (err) {
        log(`Could not get feed channel: ${err}`);
        console.error("Could not get feed channel", err);
        return [[], handleError(err as TypeError)];
    } finally {
        clearTimeout(timeoutId);
    }
    return [[], null];
}

export const add_channel = async (url: string): Promise<Channel | null> => {
    const ctrl = new AbortController();
    url = add_scheme(url);
    const timeoutId = setTimeout(() => ctrl.abort(), appConfig.requestTimeout);
    try {
        const res = await fetch(`${appConfig.panyaAPIURL}/channel`, {
            body: JSON.stringify({
                'channel_url': url,
            }),
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: ctrl.signal,
        });
        if (res.status > 200) {
            throw await res.text();
        }
        return await res.json();
    } catch (err) {
        log(`Could not add channel: ${err}`);
        console.error("Could not add channel", err);
    } finally {
        clearTimeout(timeoutId);
    }
    return null;
}
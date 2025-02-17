import { Channel } from "src/entity/channel";
import { Item } from "src/entity/item";
import { Error } from "src/errors/errors";
import { ConfigState } from "src/global_states/config";
import { TokenStorage } from "src/storages/custom/token_storage";
import appConfig from "../../appConfig";
import { make_feed_url } from "../feed_builder";
import { IdentityError } from "../identity/types";
import { Mapp } from "../map/mapp";
import { add_scheme } from "../normalization/url";
import { log } from "./logchest";

export enum TypeErrorEnum {
    Unauthorized = "Unauthorized",
    NetworkRequestFailed = "Network request failed",
    Unknown = "Unknown error",
    ReadingResponseError = "ReadingResponseError"
}

export type APIChannel = {
    url: string;
    name: string;
    source_type?: string;
    id: number;
    is_sub: boolean;
    limit?: number;
}

const handleResponse = async (res: Response): Promise<any> => {
    if (res.status === 200) {
        return await res.json();
    }
    if (res.status === 401) {
        throw new IdentityError(401, TypeErrorEnum.Unauthorized, appConfig.labels.en.UNAUTHORIZED_RELOG)
    }
    let body: any = null;
    try {
        body = await res.json();
    } catch (err) {
        throw new IdentityError(500, TypeErrorEnum.ReadingResponseError, appConfig.labels.en.SERVICE_ERROR)
    }

    if (body.error && body.error.reason && body.error.code && body.error.description) {
        throw body.error;
    }
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
): Promise<[Item[], Error | null]> => {
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), appConfig.requestTimeout);
    try {
        const token = await TokenStorage.retrieve();
        const res = await fetch(make_feed_url(channels, config), {
            credentials: "include",
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token?.jwt}`
            },
            signal: ctrl.signal,
        });
        const feed = await handleResponse(res);
        return [feed, null];
    } catch (err) {
        console.log("?heee?s", err)
        let idErr = err as IdentityError;
        if (typeof err !== "object") {
            idErr = new IdentityError(500, err as string);
        } else if (!(err instanceof IdentityError)) {
            const tmpErr = err as any
            idErr = new IdentityError(500, tmpErr.name, tmpErr.message);
        }
        log(`Could not get feed channel: ${idErr.reason}`);
        console.error("Could not get feed channel:", idErr.getMessage() || idErr.getReason());
        return [[], idErr];
    } finally {
        clearTimeout(timeoutId);
    }
}

export const add_channel = async (url: string): Promise<Channel | null> => {
    const ctrl = new AbortController();
    url = add_scheme(url);
    const timeoutId = setTimeout(() => ctrl.abort(), appConfig.requestTimeout);
    try {
        const token = await TokenStorage.retrieve();
        const res = await fetch(`${appConfig.panyaAPIURL}/channel`, {
            body: JSON.stringify({
                'channel_url': url,
            }),
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token?.jwt}`
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

export const get_channels = async (): Promise<APIChannel[]> => {
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), appConfig.requestTimeout);
    try {
        const token = await TokenStorage.retrieve();
        const res = await fetch(`${appConfig.panyaAPIURL}/channels`, {
            credentials: "include",
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token?.jwt}`
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
    return [];
}
import appConfig from "src/appConfig";
import { Channel } from "src/entity/channel";
import { ConfigState } from "src/global_states/config";
import { Mapp } from "./map/mapp";

export const make_feed_url = (
    channels: Mapp<number, Channel>,
    config?: ConfigState
): string => {
    const ids: number[] = [];
    const limits: string[] = [];
    channels
        .filter(({ value }): boolean => value.is_sub)
        .forEach((channel: Channel) => {
            ids.push(channel.channel_id);
            limits.push(`limits[${channel.channel_id}]=${channel.limit || config?.maxItemPerFeed || appConfig.maxItemPerFeed}`);
        });
    return `${appConfig.panyaAPIURL}/user/feed`
}
import { Channel } from "src/entity/channel";
import { log } from "./request/logchest";
import { add_channel } from "./request/panya";

export const add_feed_source = async (url: string): Promise<Channel | null> => {
    try {
        const channel = await add_channel(url);
        if (!channel) {
            throw "no channel in response";
        }
        if (!channel.channel_id) {
            throw "missing channel_id";
        }
        return channel;
    } catch (err) {
        log(`add_feed_source: Could not add feed source ${url}: ${err}`);
        console.error(`Could not add feed source ${url}`, err);
    }
    return null;
}

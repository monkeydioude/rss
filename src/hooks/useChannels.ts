import { Channel } from "src/entity/channel";
import { addChannel, setChannels, useDispatch as useChannelsDispatch, useGetChannels } from "src/global_states/channels";
import { add_feed_source } from "src/services/feed_builder";
import { clean_url } from "src/services/normalization/url";
import { ChannelStorage } from "src/storages/custom";
import useFeed from "./useFeed";

export const useChannels = () => {
    const channels = useGetChannels();
    const channelsDispatch = useChannelsDispatch();
    const { reload } = useFeed();

    const push = (channel: [number, Channel]) => {
        channelsDispatch(addChannel(channel));
        ChannelStorage.push(channel[0], channel[1]);
        reload();
    };

    const setSub = (channel_id: number, isSub: boolean) => {
        const channel = channels.get(channel_id);
        if (!channel) {
            return;
        }
        channel.is_sub = isSub;
        channels.set(channel_id, channel);
        ChannelStorage.update(channels);
        channelsDispatch(setChannels(channels));
        reload();
    }

    // setUrl changes the url of an already subscribed channel.
    // But really, it deletes the old channel, and then tries to add a new one
    const setUrl = async (channel_id: number, url: string) => {
        const channel = channels.get(channel_id);
        url = clean_url(url);
        if (!channel || channel.channel_name == url) {
            return;
        }
        channels.delete(channel_id);
        const new_channel = await add_feed_source(url);
        if (!new_channel) {
            return;
        }
        new_channel.is_sub = channel.is_sub;
        channels.set(new_channel.channel_id, new_channel);
        channelsDispatch(setChannels(channels));
    }

    return {
        push,
        setSub,
        setUrl,
    }
}
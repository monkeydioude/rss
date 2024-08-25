import { useCallback } from "react";
import { Channel } from "src/entity/channel";
import { addChannel, setChannels, useDispatch as useChannelsDispatch, useChannelsList } from "src/global_states/channels";
import { clean_url } from "src/services/normalization/url";
import { add_feed_source } from "src/services/request/panya";
import { ChannelStorage } from "src/storages/custom";

export const useChannels = () => {
    const channels = useChannelsList();
    const channelsDispatch = useChannelsDispatch();

    // push adds a new channel to the list and update the local storage.
    const push = (channel: [number, Channel]) => {
        ChannelStorage
            .push(channel[0], channel[1])
            .then(() => channelsDispatch(addChannel(channel)));
    };

    // setSub modifies the subscription to a channel, meaning should we request
    // the API for this channel's content. Modifies the local storage.
    const setSub = useCallback((channel_id: number, isSub: boolean) => {
        const channel = channels.get(channel_id);
        if (!channel) {
            return;
        }
        channel.is_sub = isSub;
        channels.set(channel_id, channel);
        ChannelStorage
            .update(channels)
            .then(() => channelsDispatch(setChannels(channels)));
    }, [channels]);

    // setUrl changes the url of an already subscribed channel.
    // But really, it deletes the old channel, and then tries to add a new one.
    // Modifies the local storage.
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
        ChannelStorage
            .update(channels)
            .then(() => channelsDispatch(setChannels(channels)));
    }

    return {
        push,
        setSub,
        setUrl,
    }
}
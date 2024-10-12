import { useCallback } from "react";
import { Channel, ChannelsError, ChannelsErrorEnum } from "src/entity/channel";
import { addChannel, setChannels, useDispatch as useChannelsDispatch, useChannelsList } from "src/global_states/channels";
import i18n from "src/i18n";
import { clean_url } from "src/services/normalization/url";
import { log_any } from "src/services/request/logchest";
import { add_feed_source } from "src/services/request/panya";
import toast from "src/services/toast";
import { ChannelStorage } from "src/storages/custom";

export const useChannels = () => {
    const channels = useChannelsList();
    const channelsDispatch = useChannelsDispatch();

    // push adds a new channel to the list and update the local storage.
    const push = useCallback(async (channel: [number, Channel]) => {
        await ChannelStorage
            .push(channel[0], channel[1])
            .then(() => channelsDispatch(addChannel(channel)));
    }, []);

    const remove = useCallback(async (channel: Channel) => {
        try {
            if (!channels.delete(channel.channel_id)) {
                return;
            }
            ChannelStorage
                .update(channels)
                .then(() => channelsDispatch(setChannels(channels)));
        } catch (e) {
            console.error(e);
            log_any(e);
            toast.err(i18n.en.SETTINGS_SOURCES_REMOVE_FEED_ERR);
        }
    }, [channels]);

    // setSub modifies the subscription to a channel, meaning should we request
    // the API for this channel's content. Modifies the local storage.
    const setSub = useCallback((channel_id: number, isSub: boolean): boolean => {
        const channel = channels.get(channel_id);
        if (!channel) {
            return false;
        }
        channel.is_sub = isSub;
        channels.set(channel_id, channel);
        ChannelStorage
            .update(channels)
            .then(() => channelsDispatch(setChannels(channels)));
        return true;
    }, [channels]);

    // setUrl changes the url of an already subscribed channel.
    // But really, it deletes the old channel, and then tries to add a new one.
    // Modifies the local storage.
    const setUrl = async (channel_id: number, url: string): Promise<ChannelsError> => {
        if (channels.find(({ value: channel }) => channel.channel_name == url)) {
            return ChannelsErrorEnum.AlreadyExists
        }
        const channel = channels.get(channel_id);
        url = clean_url(url);
        if (!channel || channel.channel_name == url) {
            return null;
        }
        channels.delete(channel_id);
        const new_channel = await add_feed_source(url);
        if (!new_channel) {
            return ChannelsErrorEnum.URLIssue;
        }
        new_channel.is_sub = channel.is_sub;
        channels.set(new_channel.channel_id, new_channel);
        ChannelStorage
            .update(channels)
            .then(() => channelsDispatch(setChannels(channels)));
        return null;
    }

    return {
        push,
        remove,
        setSub,
        setUrl,
    }
}
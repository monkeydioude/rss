import { useCallback } from "react";
import { Channel } from "src/entity/channel";
import { Item } from "src/entity/item";
import { useChannelsList } from "src/global_states/channels";
import { ConfigState, useConfig } from "src/global_states/config";
import { reloadFeed, setFeed, useDispatch as useFeedDispatch } from "src/global_states/feed";
import { Mapp } from "src/services/map/mapp";
import { get_feed } from "src/services/request/panya";
import { FeedStorage } from "src/storages/custom";

const useFeed = () => {
    const feedDispatch = useFeedDispatch();
    const channelsList = useChannelsList();
    const config = useConfig();

    const reload = useCallback(async () => {
        feedDispatch(reloadFeed());
    }, [config, channelsList]);

    const fetchStoreAndSetFeed = async (
        channels: Mapp<number, Channel>,
        config: ConfigState,
    ) => {
        let feed = await get_feed(channels, config);
        if (feed.length === 0) {
            feed = await FeedStorage.retrieve() || [];
            if (feed.length === 0) {
                return;
            }
        }

        await storeAndSetFeed(feed);
    }

    const storeAndSetFeed = async(
        feed: Item[]
    ) => {
        FeedStorage.update(feed);
        feedDispatch(setFeed(feed));
    }

    return {
        reload,
        fetchStoreAndSetFeed,
        storeAndSetFeed,
    };
};

export default useFeed;

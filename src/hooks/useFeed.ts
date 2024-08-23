import { useCallback } from "react";
import { useChannelsList } from "src/global_states/channels";
import { useConfig } from "src/global_states/config";
import { reloadFeed, useDispatch as useFeedDispatch } from "src/global_states/feed";

const useFeed = () => {
    const feedDispatch = useFeedDispatch();
    const channelsList = useChannelsList();
    const config = useConfig();

    const reload = useCallback(async () => {
        feedDispatch(reloadFeed());
    }, [config, channelsList]);

    return { reload };
};

export default useFeed;

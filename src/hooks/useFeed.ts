import { useSubbedChannelIDs } from "src/global_states/channels";
import { setFeed, useDispatch as useFeedDispatch } from "src/global_states/feed";
import { get_feed } from "src/services/request/panya";

const useFeed = () => {
    const feedDispatch = useFeedDispatch();
    const channelIDs = useSubbedChannelIDs();

    const reload = async () => {
        feedDispatch(setFeed(await get_feed(channelIDs)));
    }

    return { reload };
};

export default useFeed;

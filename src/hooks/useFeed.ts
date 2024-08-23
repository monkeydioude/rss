import { useChannels } from "src/global_states/channels";
import { setFeed, useDispatch as useFeedDispatch } from "src/global_states/feed";
import { get_feed } from "src/services/request/panya";

const useFeed = () => {
    const feedDispatch = useFeedDispatch();
    const channels = useChannels();

    const load = async () => {
        feedDispatch(setFeed(await get_feed(channels.keys_slice())));
    }

    return [load];
};

export default useFeed;

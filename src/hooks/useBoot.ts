import { useContext, useEffect, useState } from "react";
import { FeedsContext } from "../context/feedsContext";
// import { loadAndUpdateFeeds } from "../feed_builder";
// import { RSSItem } from "../data_struct";
import appConfig from "../appConfig";
import config from "../service/config";
import { log } from "../service/logchest";
import { Storage } from "src/service/data_storage";
import { setChannels, useChannelIDs, useDispatch as useChannelsDispatch} from "src/store/channels";
import { setFeed, useDispatch as useFeedDispatch} from "src/store/feed";
import { get_feed } from "src/service/request/panya";
const useBoot = (onBootFinish?: () => void): boolean => {
    const [bootFinished, setBootFinished] = useState<boolean>(false);
    const channelsDispatch = useChannelsDispatch();
    const feedDispatch = useFeedDispatch()

    const reloadAndSetInterval = async () => {
        // newRSSDataCollection().delete_all();
        // @TODO: get_feed
        // await loadAndUpdateFeeds((feeds: RSSItem[]) => setFeeds([...feeds]), appConfig.bootFetchRequestTimeout);
        setInterval(() => {
            // @TODO: get_feed
            // loadAndUpdateFeeds((feeds: RSSItem[]) => setFeeds([...feeds]));
        }, appConfig.feedsRefreshTimer);
    }

    // loadLocalChannels try to fetch channels ids from local storage
    // and hydrate our channels store with them
    const loadLocalChannels = async (): Promise<number[]> => {
        try {
            console.log(">> Loading channels STARTING")
            const raw = await (new Storage(appConfig.storageKeys.channel_ids)).select();
            const channelIDs = JSON.parse(raw)
            channelsDispatch(setChannels(channelIDs || []));
            console.log("<< Loading channels DONE")
            return channelIDs;
        } catch (err) {
            console.error("Boot: could not load local channels");
            log(`Boot: could not load local channels: ${err}`);
        }
        return [];
    }

    const loadFeed = async (channelIDs: number[]) => {
        try {
            console.log(">> Loading feed STARTING")
            feedDispatch(setFeed(await get_feed(channelIDs)));
            console.log("<< Loading feed DONE")
        } catch (err) {
            console.error("Boot: could not load feed");
            log(`Boot: could not load feed: ${err}`);
        } 
    }

    useEffect(() => {
        (async () => {
            try {
                // await sleep(1000000);
                // start app boot routine.
                console.log("!!! Boot STARTING !!!")
                await config.load();
                await reloadAndSetInterval();
                // hydrate channels store with localStorage data
                const channelIDs = await loadLocalChannels();
                // load latest feed items
                await loadFeed(channelIDs);
                if (onBootFinish) {
                    onBootFinish();
                }
                setBootFinished(true);
                console.log("!!! Boot DONE !!!")
            } catch (e) {
                // @todo: warning/error msg in app
                log("" + e);
                console.error(e);
            }
        })();
    }, []);

    return bootFinished;
}

export default useBoot;
import { useEffect, useState } from "react";
// import { loadAndUpdateFeeds } from "../feed_builder";
// import { RSSItem } from "../data_struct";
import { Storage } from "src/services/data_storage";
import { get_feed } from "src/services/request/panya";
import { setChannels, useDispatch as useChannelsDispatch } from "src/stores/channels";
import { setFeed, useDispatch as useFeedDispatch } from "src/stores/feed";
import appConfig from "../appConfig";
import config from "../services/config";
import { log } from "../services/logchest";

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
    const loadLocalChannels = async (): Promise<Map<number, string>> => {
        try {
            console.log(">> Loading channels STARTING")
            const raw = await (new Storage(appConfig.storageKeys.channel_ids)).select();
            const res = JSON.parse(raw);
            const channelIDs = new Map<number, string>(res);
            channelsDispatch(setChannels(channelIDs));
            console.log("<< Loading channels DONE")
            return channelIDs;
        } catch (err) {
            console.error("Boot: could not load local channels", err);
            log(`Boot: could not load local channels: ${err}`);
        }
        return new Map();
    }

    const loadFeed = async (channelIDs: Map<number, string>) => {
        try {
            console.log(">> Loading feed STARTING")
            feedDispatch(setFeed(await get_feed(Array.from(channelIDs.keys()))));
            console.log("<< Loading feed DONE")
        } catch (err) {
            console.error("Boot: could not load feed");
            log(`Boot: could not load feed: ${err}`);
        } 
    }

    useEffect(() => {
        (async () => {
            try {
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
import { useEffect, useState } from "react";
import { Channel } from "src/entity/channel";
import { setChannels, useDispatch as useChannelsDispatch, useChannelsList } from "src/global_states/channels";
import { initConfig, useConfig, useDispatch as useConfigDispatch } from "src/global_states/config";
import { setFeed, useDispatch as useFeedDispatch, useReloadFeed } from "src/global_states/feed";
import logger from "src/services/logger";
import { Mapp } from 'src/services/map/mapp';
import { log } from "src/services/request/logchest";
import { ChannelStorage, ConfigStorage, FeedStorage } from "src/storages/custom";
import { useFeedRefresh } from "./useFeedRefresh";

// useBoot is a hook handling the app boot sequence configuration.
// Should (and will) be called only once.
const useBoot = (onBootFinish?: () => void): boolean => {
    const [bootFinished, setBootFinished] = useState<boolean>(false);
    const channelsDispatch = useChannelsDispatch();
    const configDispatch = useConfigDispatch();
    const feedDispatch = useFeedDispatch();
    const channelsList = useChannelsList();
    const witness = useReloadFeed();
    const config = useConfig();
    const { managedFeedRefresh, resetCoroutineFeedRefresh } = useFeedRefresh();

    useEffect(() => {
        if (!bootFinished) {
            return;
        }
        resetCoroutineFeedRefresh(channelsList, config);
        managedFeedRefresh(channelsList, config);
    }, [channelsList, bootFinished, config, witness]);

    // bootLocalChannels try to fetch channels ids from local storage
    // and hydrate our channels global state with them
    // (until we have user login).
    const bootLocalChannels = async (): Promise<Mapp<number, Channel>> => {
        let channels = new Mapp<number, Channel>();
        try {
            logger.info(">> 📺 Channels loader STARTING")
            channels = await ChannelStorage.retrieveOrNew();
            channelsDispatch(setChannels(channels));
            logger.info("<< 📺 Channels loader DONE")
        } catch (err) {
            console.error("💀 could not load local channels", err);
            log(`Boot: could not load local channels: ${err}`);
        }
        return channels;
    }

    // bootFeed starts the feed loading and feed refresh routines.
    // Feed loading implies a call to the API using locally stored
    // channel ids.
    const bootFeed = async () => {
        try {
            logger.info(">> 📰 Feed loader STARTING")
            const feed = await FeedStorage.retrieve();
            feedDispatch(setFeed(feed || []));
            logger.info("<< 📰 Feed loader DONE")
        } catch (err) {
            console.error("💀 could not load feed");
            log(`Boot: could not load feed: ${err}`);
        } 
    }

    // bootLocalUserConfig handles loading of the user config, from the 
    // local storage into the app
    const bootLocalUserConfig = async () => {
        try {
            logger.info(">> ⚙️ Config loader STARTING");
            const config = await ConfigStorage.retrieve();
            if (!config) {
                logger.info(":O ⚙️ No config to retrieve from storage");
                logger.info("<< ⚙️ Config loader DONE");
                return ;
            }
            configDispatch(initConfig(config));
            logger.info("<< ⚙️ Config loader DONE");
        } catch (err) {
            console.error("💀 could not load config", err);
            log(`Boot: could not load config: ${err}`);
        }
    }

    useEffect(() => {
        // in case of global state modification that would re-trigger the boot sequence.
        // Also in dev, so Expo hot reload won't fire this every time it refreshes.
        if (bootFinished) {
            return;
        }
        (async () => {
            try {
                // start app boot routine.
                logger.info("!!! 🏁 Boot STARTING !!!")
                await bootLocalUserConfig();
                // hydrate channels store with localStorage data
                await bootLocalChannels();
                // load latest feed items
                await bootFeed();
                if (onBootFinish) {
                    onBootFinish();
                }
                setBootFinished(true);
                logger.info("!!! 🚀 Boot DONE !!!")
            } catch (e) {
                // @todo: warning/error msg in app
                log("" + e);
                console.error("💀", e);
            }
        })();
    }, []);

    return bootFinished;
}

export default useBoot;
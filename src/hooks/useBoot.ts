import { useEffect, useRef, useState } from "react";
import appConfig from "src/appConfig";
import { Channel } from "src/entity/channel";
import { setChannels, useDispatch as useChannelsDispatch, useChannelsList } from "src/global_states/channels";
import { initConfig, useConfig, useDispatch as useConfigDispatch } from "src/global_states/config";
import { setFeed, useDispatch as useFeedDispatch, useReloadFeed } from "src/global_states/feed";
import logger from "src/services/log";
import { Mapp } from 'src/services/map/mapp';
import { log } from "src/services/request/logchest";
import { get_feed } from "src/services/request/panya";
import { ChannelStorage, ConfigStorage } from "src/storages/custom";

// useBoot is a hook handling the app boot sequence configuration.
// Should (and will) be called only once.
const useBoot = (onBootFinish?: () => void): boolean => {
    const [bootFinished, setBootFinished] = useState<boolean>(false);
    const channelsDispatch = useChannelsDispatch();
    const configDispatch = useConfigDispatch();
    const feedDispatch = useFeedDispatch();
    const channelsList = useChannelsList();
    const witness = useReloadFeed();
    // using an array of seeds, because multiple trigger, especially in dev mode
    // could erase refreshIntervalSeed
    let refreshIntervalSeed = useRef([] as NodeJS.Timeout[]);
    let lastReload = useRef(0);
    const config = useConfig();

    // reloadAndSetInterval handles the auto refresh of the feed
    const reloadAndSetInterval = async (channels: Mapp<number, Channel>) => {
        logger.info(`!! 📰 Feed refresh set to ${appConfig.feedsRefreshTimer / 1000}s`);
        // cleaning intervals first, to make sure we dont run several async setIntervals at a same time.
        clearIntervals(refreshIntervalSeed.current);
        refreshIntervalSeed.current.push(setInterval(async () => {
            try {
                // poor people's protection. Should actually put a lock here.
                if (lastReload.current + appConfig.feedsRefreshTimer > +new Date()) {
                    return;
                }
                lastReload.current = +new Date();
                const feed = await get_feed(channels, config);
                feedDispatch(setFeed(feed));
            } catch (err) {
                console.error("💀 could not refresh the feed", err);
            }
        }, appConfig.feedsRefreshTimer));
    }
    
    const clearIntervals = (seeds: NodeJS.Timeout[]) => {
        seeds.forEach(seed => clearInterval(seed));
        seeds = [];
    }

    useEffect(() => {
        (async () => {
            if (!bootFinished || lastReload.current + appConfig.feedsRefreshTimer > +new Date()) {
                return;
            }
            feedDispatch(setFeed(await get_feed(channelsList, config)));
            lastReload.current = +new Date();
            reloadAndSetInterval(channelsList);
        })();
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
    const bootFeed = async (channels: Mapp<number, Channel>) => {
        try {
            logger.info(">> 📰 Feed loader STARTING")
            feedDispatch(setFeed(await get_feed(channelsList, config)));
            reloadAndSetInterval(channels);
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
                const channels = await bootLocalChannels();
                // load latest feed items
                await bootFeed(channels);
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

        // Unmount sequence.
        return () => {
            clearIntervals(refreshIntervalSeed.current);
        }
    }, []);

    return bootFinished;
}

export default useBoot;
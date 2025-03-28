import { useCallback, useEffect, useRef } from "react";
import appConfig from "src/appConfig";
import { Channel } from "src/entity/channel";
import { ConfigState } from "src/global_states/config";
import { setLastRefresh, useRefresh, useDispatch as useRefreshDispatch } from "src/global_states/refresh";
import { shouldReload } from "src/services/feed/refresh";
import logger from "src/services/logger";
import { Mapp } from "src/services/map/mapp";
import sleep from "src/services/time";
import useFeed from "./useFeed";

export const useFeedRefresh = () => {
    const { lastRefresh } = useRefresh();
    const dispatch = useRefreshDispatch();

    // const lastReloadRef = useRef(0);
    // using an array of seeds, because multiple trigger, especially in dev mode
    // could erase refreshIntervalSeed
    let refreshIntervalSeed = useRef([] as NodeJS.Timeout[]);
    const { fetchStoreAndSetFeed } = useFeed();

    const clearIntervals = (seeds: NodeJS.Timeout[]) => {
        seeds.forEach(seed => clearInterval(seed));
        seeds = [];
    }

    // resetCoroutineFeedRefresh handles the auto refresh of the feed
    const resetCoroutineFeedRefresh = useCallback(async (
        channels: Mapp<number, Channel>,
        config: ConfigState,
    ) => {
        logger.info(`!! 📰 Feed refresh set to ${appConfig.feedsRefreshTimer / 1000}s`);
        // cleaning intervals first, to make sure we dont run several async setIntervals at a same time.
        clearIntervals(refreshIntervalSeed.current);
        if (!shouldReload(lastRefresh)) {
            logger.info(`!! 📰 sleeping for ${lastRefresh + appConfig.feedsRefreshTimer - +new Date()}`);
            await sleep(lastRefresh + appConfig.feedsRefreshTimer - +new Date());
            await managedFeedRefresh(channels, config, "auto");
        }
        refreshIntervalSeed.current.push(setInterval(async () => {
            try {
                const [res, err] = shouldReload(lastRefresh);
                // poor people's protection. Should actually put a lock here.
                if (!res) {
                    logger.info(`could not refresh through coroutine: ${err.toString()}`);
                    return;
                }
                await managedFeedRefresh(channels, config, "auto");
            } catch (err) {
                console.error("💀 could not refresh the feed", err);
            }
        }, appConfig.feedsRefreshTimer));
    }, []);


    const managedFeedRefresh = useCallback(async (
        channelsList: Mapp<number, Channel>,
        config: ConfigState,
        method: "auto" | "manual",
    ) => {
        const [res, err] = shouldReload(lastRefresh, appConfig.feedsManualRefreshTimer);
        if (!res) {
            logger.info(`could not directly refresh: ${err.toString()}`);
            return;
        }
        if (method === "manual") {
            dispatch(setLastRefresh({ lastRefresh: +new Date(), method }));
        }
        if (!await fetchStoreAndSetFeed(channelsList, config)) {
            return;
        }
        // dispatch(setLastRefresh({ lastRefresh: tmpDate, method }));
        // setLastReload(tmpDate);
    }, [lastRefresh]);

    useEffect(() => {
        return () => clearIntervals(refreshIntervalSeed.current);
    }, []);

    return {
        resetCoroutineFeedRefresh,
        managedFeedRefresh,
        }
}

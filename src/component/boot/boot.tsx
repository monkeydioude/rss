import React, { useEffect, useState } from "react";
// import { FeedsContext } from "../../context/feedsContext";
// import { loadAndUpdateFeeds } from "../../feed_builder";
import config from "../../service/config";
import { log } from "../../service/logchest";
import { setChannels, useChannelIDs, useDispatch as useChannelsDispatch} from "src/store/channels";
import appConfig from "src/appConfig";
import { Storage } from "src/service/data_storage";
import { setFeed, useDispatch as useFeedDispatch} from "src/store/feed";
import { get_feed } from "src/service/request/panya";

interface Props {
    onBootFinish?: () => void;
    children: JSX.Element;
}

const Boot = ({ onBootFinish, children }: Props): JSX.Element => {
    const [bootFinish, setBootFinish] = useState<boolean>(false);
    // const { setFeeds } = useContext(FeedsContext);
    const channelsDispatch = useChannelsDispatch();
    const feedDispatch = useFeedDispatch()

    // loadLocalChannels try to fetch channels ids from local storage
    // and hydrate our channels store with them
    const loadLocalChannels = async () => {
        try {
            console.log("Start loading channels")
            const raw = await (new Storage(appConfig.storageKeys.channel_ids)).select();
            channelsDispatch(setChannels(JSON.parse(raw) || []));
        } catch (err) {
            console.error("Boot: could not load local channels");
            log(`Boot: could not load local channels: ${err}`);
        }
    }

    const loadFeed = async () => {
        try {
            console.log(`Start loading feed: [${useChannelIDs()}]`);
            console.log(useChannelIDs())
            feedDispatch(setFeed(await get_feed(useChannelIDs())));
        } catch (err) {
            console.error("Boot: could not load feed");
            log(`Boot: could not load feed: ${err}`);
        } 
    }

    useEffect(() => {
        (async () => {
            try {
                // start app boot routine.
                await config.load();
                // await reloadAndSetInterval();

                // hydrate channels store with localStorage data
                await loadLocalChannels();
                // load latest feed items
                await loadFeed();
                if (onBootFinish) {
                    onBootFinish();
                }
                setBootFinish(true);
            } catch (e) {
                // @todo: warning/error msg in app
                log("" + e);
                console.error(e);
            }
        })();
    }, []);
    return (
        <>
            {bootFinish ? children : <></>}
        </>
    )
}

export default Boot;
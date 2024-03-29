import React, { useContext, useEffect, useState } from "react";
import { FeedsContext } from "../../context/feedsContext";
import { loadAndUpdateFeeds } from "../../feed_builder";
import { RSSItem } from "../../data_struct";
import appConfig from "../../appConfig";
import config from "../../service/config";
import { log } from "../../service/logchest";

interface Props {
    onBootFinish?: () => void;
    children: JSX.Element;
}

const Boot = ({ onBootFinish, children }: Props): JSX.Element => {
    const [bootFinish, setBootFinish] = useState<boolean>(false);
    const { setFeeds } = useContext(FeedsContext);

    const reloadAndSetInterval = async () => {
        // newRSSDataCollection().delete_all();
        await loadAndUpdateFeeds((feeds: RSSItem[]) => setFeeds([...feeds]), appConfig.bootFetchRequestTimeout);
        setInterval(() => {
            loadAndUpdateFeeds((feeds: RSSItem[]) => setFeeds([...feeds]));
        }, appConfig.feedsRefreshTimer);
    }

    useEffect(() => {
        (async () => {
            try {
                // start app boot routine.
                await config.load();
                await reloadAndSetInterval();

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
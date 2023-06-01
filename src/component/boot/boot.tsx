import React, { useContext, useEffect, useState } from "react";
import { FeedsContext } from "../../context/feedsContext";
import { loadAndUpdateFeeds } from "../../feed_builder";
import { RSSItem } from "../../data_struct";
import defaultConfig from "../../../defaultConfig";
import config from "../../service/config";
import { newRSSDataCollection } from "../../data_struct";

interface Props {
    onBootFinish?: () => void;
    children: JSX.Element;
}

const Boot = ({ onBootFinish, children }: Props): JSX.Element => {
    const [bootFinish, setBootFinish] = useState<boolean>(false);
    const { setFeeds } = useContext(FeedsContext);

    const reloadAndSetInterval = async () => {
        // newRSSDataCollection().delete_all();
        await loadAndUpdateFeeds((feeds: RSSItem[]) => setFeeds([...feeds]), defaultConfig.bootFetchRequestTimeout);
        setInterval(() => {
            loadAndUpdateFeeds((feeds: RSSItem[]) => setFeeds([...feeds]));
        }, defaultConfig.feedsRefreshTimer);
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
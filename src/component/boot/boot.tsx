import React, { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../../context/configContext";
import { FeedsContext } from "../../context/feedsContext";
import { getUnsubbedProvidersFeeds, loadAndUpdateFeeds } from "../../feed_builder";
import { RSSItem } from "../../data_struct";
import config from "../../../config";

interface Props {
    onBootFinish?: () => void;
    children: JSX.Element;
}

const Boot = ({ onBootFinish, children }: Props): JSX.Element => {
    const [bootFinish, setBootFinish] = useState<boolean>(false);
    const { loadConfig } = useContext(ConfigContext);
    const { setFeeds } = useContext(FeedsContext);


    useEffect(() => {
        (async () => {
            try {
                // start app boot routine.
                loadConfig();
                setFeeds(await getUnsubbedProvidersFeeds());
                await loadAndUpdateFeeds((feeds: RSSItem[]) => setFeeds([...feeds]), config.bootFetchRequestTimeout);
                setInterval(() => {
                    loadAndUpdateFeeds((feeds: RSSItem[]) => setFeeds([...feeds]));
                }, config.feedsRefreshTimer);

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
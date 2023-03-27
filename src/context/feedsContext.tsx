import { createContext, useContext, useEffect, useState } from "react";
import { RSSItem } from "../data_struct";
import React from "react";
import { loadAndUpdateFeeds } from "../feed_builder";
import config from "../../config";
import { EventsContext } from "./eventsContext";
import { ConfigContext } from "./configContext";

type FeedContext = {
    setFeeds: (feeds: RSSItem[]) => void,
    feeds: RSSItem[],
};

export const FeedsContext = createContext<FeedContext>({
    setFeeds: _ => {},
    feeds: []
});

type Props = {
    children: JSX.Element,
}

const FeedsProvider = ({ children }: Props): JSX.Element => {
    const [ feeds, setFeeds ] = useState<RSSItem[]>([]);
    const { trigger } = useContext(EventsContext);
    const { loadConfig } = useContext(ConfigContext);

    const setFeedsProvider = (f: RSSItem[]) => {
        setFeeds(f);
        trigger(config.events.set_feeds);
    }

    useEffect(() => {
        loadAndUpdateFeeds((feeds: RSSItem[]) => setFeeds([...feeds]))
        .then(() => {
            loadConfig();
            setInterval(() => {
                loadAndUpdateFeeds((feeds: RSSItem[]) => setFeeds([...feeds]));
            }, config.feedsRefreshTimer)  
        });
    }, []);

    return (
        <FeedsContext.Provider value={{
            setFeeds: setFeedsProvider,
            feeds,
        }}>
        {children}
        </FeedsContext.Provider>
    )
}

export default FeedsProvider;
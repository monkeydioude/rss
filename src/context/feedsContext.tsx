import { createContext, useContext, useEffect, useState } from "react";
import { RSSItem } from "../data_struct";
import React from "react";
import config from "../../config";
import { EventsContext } from "./eventsContext";

export type SetFeedsCB = (f: RSSItem[]) => void;

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

    const setFeedsProvider = (f: RSSItem[]) => {
        setFeeds(f);
        trigger(config.events.set_feeds, f);
    }

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
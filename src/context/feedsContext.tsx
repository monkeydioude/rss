import { createContext, useContext, useEffect, useRef, useState } from "react";
import { RSSItem } from "../data_struct";
import React from "react";
import config from "../../defaultConfig";
import { EventsContext } from "./eventsContext";
import { reloadFeeds as _reloadFeeds } from "../feed_builder";

export type SetFeedsCB = (f: RSSItem[]) => void;
export interface FeedItemFilterRemover {
    (): void;
}
export interface FeedItemFilter {
    (item: RSSItem): boolean;
}

interface FeedItemFilterContainer {
    symbol: Symbol;
    filter: FeedItemFilter;
}

type FeedContext = {
    pushFilter: (filter: FeedItemFilter, symbol?: Symbol) => FeedItemFilterRemover;
    setFeeds: (feeds: RSSItem[]) => void,
    feeds: RSSItem[],
    reloadFeeds: () => Promise<void>,
};

export const FeedsContext = createContext<FeedContext>({
    pushFilter: (): (() => void) => () => { },
    setFeeds: _ => { },
    reloadFeeds: async () => {},
    feeds: []
});

type Props = {
    children: JSX.Element,
}

const FeedsProvider = ({ children }: Props): JSX.Element => {
    const [feeds, setFeeds] = useState<RSSItem[]>([]);
    const { trigger } = useContext(EventsContext);
    const filters = useRef([]);

    const reloadFeeds = async() => {
        await _reloadFeeds(setFeedsProvider)
    }

    const applyFilters = (item: RSSItem): boolean => {
        if (filters.current.length === 0) {
            return true;
        }
        return filters.current.every((fc: FeedItemFilterContainer) => {
            return fc.filter(item);
        })
    }

    const setFeedsProvider = (f: RSSItem[]) => {
        const ff = f.filter((item: RSSItem) => {
            return applyFilters(item);
        });
        setFeeds(ff);
        trigger(config.events.set_feeds, ff);
    }


    const removeFilter = (symbol: Symbol) => {
        let _filters = [];
        filters.current.forEach((f: FeedItemFilterContainer) => {
            if (f.symbol === symbol) {
                return;
            }
            _filters.push(f);
        });
        filters.current = _filters;
    }

    const pushFilter = (filter: FeedItemFilter, _symbol?: Symbol): FeedItemFilterRemover => {
        let symbol = _symbol || Symbol();

        if (_symbol !== undefined) {
            removeFilter(_symbol);
        }

        const fc: FeedItemFilterContainer = {
            symbol,
            filter: filter,
        };

        filters.current.push(fc);

        return () => {
            removeFilter(symbol);
        };
    }

    return (
        <FeedsContext.Provider value={{
            reloadFeeds,
            pushFilter,
            setFeeds: setFeedsProvider,
            feeds,
        }}>
            {children}
        </FeedsContext.Provider>
    )
}

export default FeedsProvider;
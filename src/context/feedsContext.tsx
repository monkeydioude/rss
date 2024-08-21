import React, { createContext, useContext, useRef, useState } from "react";
import config from "../appConfig";
import { RSSItem } from "../data_struct";
import { reloadFeeds as _reloadFeeds } from "../services/feed_builder";
import { log } from "../services/request/logchest";
import { EventsContext } from "./eventsContext";

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
    pushFilter: (filter: FeedItemFilter, symbol?: Symbol) => FeedItemFilterRemover,
    hasFilters: () => boolean,
    setFeeds: (feeds: RSSItem[]) => void,
    feeds: RSSItem[],
    reloadFeeds: () => Promise<void>,
};

export const FeedsContext = createContext<FeedContext>({
    pushFilter: (): (() => void) => () => { },
    hasFilters: () => false,
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
    const filters = useRef<FeedItemFilterContainer[]>([]);

    const setFeedsProvider = (f: RSSItem[]) => {
        const ff = f.filter((item: RSSItem) => {
            return applyFilters(item);
        });
        setFeeds(ff);
        trigger(config.events.set_feeds, ff);
    }

    let reloadFeeds = async() => {
        await _reloadFeeds(setFeedsProvider)
    }

    const applyFilters = (item: RSSItem): boolean => {
        try {
            if (filters.current.length === 0) {
                return true;
            }
    
            return filters.current.every((fc: FeedItemFilterContainer) => {
                try {
                    return fc.filter(item);
                }
                catch (err) {
                    log("filters.current.every: err with filter "+ fc + ": "+ err)
                    console.error("filters.current.every: err with filter "+ fc + ": "+ err)
                }
            })
        }
        catch (err) {
            log("applyFilters: error: "+ err)
            console.error("applyFilters: error:"+ err)
            return false
        }
    }

    const removeFilter = (symbol: Symbol) => {
        let _filters: FeedItemFilterContainer[] = [];
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
    
    const hasFilters = (): boolean => {
        return filters.current.length > 0;
    }

    return (
        <FeedsContext.Provider value={{
            reloadFeeds,
            pushFilter,
            hasFilters,
            setFeeds: setFeedsProvider,
            feeds,
        }}>
            {children}
        </FeedsContext.Provider>
    )
}

export default FeedsProvider;
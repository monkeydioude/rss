import React, { createContext, useRef, useState } from "react";
import { Item } from "src/entity/item";
import { log } from "src/services/request/logchest";

export interface FeedItemFilterRemover {
    (): void;
}
export interface FeedItemFilter {
    (item: Item): boolean;
}

interface FeedItemFilterContainer {
    symbol: Symbol;
    filter: FeedItemFilter;
}

type FeedContext = {
    pushFilter: (filter: FeedItemFilter, symbol?: Symbol) => FeedItemFilterRemover,
    hasFilters: () => boolean,
    feeds: Item[],
    reloadFeeds: () => Promise<void>,
};

export const FeedsContext = createContext<FeedContext>({
    pushFilter: (): (() => void) => () => { },
    hasFilters: () => false,
    reloadFeeds: async () => {},
    feeds: []
});

type Props = {
    children: JSX.Element,
}

const FeedsProvider = ({ children }: Props): JSX.Element => {
    const [feeds, setFeeds] = useState<Item[]>([]);
    const filters = useRef<FeedItemFilterContainer[]>([]);

    let reloadFeeds = async() => {
        // await _reloadFeeds(setFeedsProvider)
    }

    const applyFilters = (item: Item): boolean => {
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
            feeds,
        }}>
            {children}
        </FeedsContext.Provider>
    )
}

export default FeedsProvider;
import { createContext, useContext, useReducer } from "react";
import { Item } from "src/entity/item";
import { applyFilters, FeedItemFilter } from "src/services/feed/filter";

type FeedState = {
    feed: Item[],
    witness: Symbol,
    filters: FeedItemFilter[],
    filtersMatch: string,
}

const initialState: FeedState = {
    feed: [],
    witness: Symbol(),
    filters: [],
    filtersMatch: "",
}

export const Context = createContext<[FeedState, React.Dispatch<Action>]>([initialState, () => {console.error("too soon to call feed dispatch")}])

/***********************   SELECTORS   ***********************/

export const useGetFeed = (): Item[] => {
	const [{ feed }] = useContext(Context)
    return feed;
}

export const useReloadFeed = (): Symbol => {
	const [{ witness }] = useContext(Context)
    return witness;
}

export const useFilteredFeed = (): Item[] => {
    const [{ filters, filtersMatch }] = useContext(Context)
    const feeds = useGetFeed().map((item: Item) => ({...item}));
    if (filters.length == 0) {
        return feeds;
    }
    return feeds.filter((item: Item) => applyFilters(filters, filtersMatch, item));
}

/***********************   REDUCERS   ***********************/

const _set_feed = (state: FeedState, feed: Item[]): FeedState => {
	return {
		...state,
		feed: [...feed],
	}
}

const _reload_feed = (state: FeedState): FeedState => {
    return {
        ...state,
        witness: Symbol(),
    };
}

const _add_feed_filter = (state: FeedState, filter: FeedItemFilter, _symbol?: Symbol): FeedState => {
    state.filters.push(filter);

    return { ...state };
}

const _reset_feed_filters = (state: FeedState): FeedState => {
    return {
        ...state,
        filters: [],
    };
}

const _add_feed_filter_match = (state: FeedState, filtersMatch: string): FeedState => {
    return {
        ...state,
        filtersMatch,
    }
}

export type Action = {
	payload: any
	func: (state: FeedState, any: any) => FeedState
}

const reducer = (state: FeedState, action: Action): FeedState => {
	try {
		if (action.func) {
			return action.func(state, action.payload);
		}
	} catch (err) {
		console.error("config reducer", err);
	}
	return state
}

const actions = {
	setFeed: (payload: Item[]) => ({
		payload,
		func: _set_feed,
    }),
    reloadFeed: () => ({
        payload: null,
        func: _reload_feed,
    }),
    addFeedFilter: (payload: FeedItemFilter) => ({
        payload,
        func: _add_feed_filter,
    }),
    resetFeedFilters: () => ({
        payload: null,
        func: _reset_feed_filters,
    }),
    addFeedFilterMatch: (payload: string) => ({
        payload,
        func: _add_feed_filter_match,
    })
}

/***********************   CONTEXT   ***********************/

const FeedProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, initialState)
	
	return (
		<Context.Provider value={[state, dispatch]}>
		{children}
		</Context.Provider>
	)
}

export const useDispatch = (): React.Dispatch<Action> => {
	const [_, dispatch] = useContext(Context)
	return dispatch
}

export default FeedProvider

export const {
    setFeed,
    reloadFeed,
    addFeedFilter,
    resetFeedFilters,
    addFeedFilterMatch,
} = actions

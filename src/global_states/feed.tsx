import { createContext, useContext, useReducer } from "react";
import { Item } from "src/entity/item";
import { log } from "src/services/request/logchest";

export interface FeedItemFilter {
    (item: Item): boolean;
}

interface FeedItemFilterContainer {
    symbol: Symbol;
    filter: FeedItemFilter;
}

type FeedState = {
    feed: Item[],
    witness: Symbol,
    filters: FeedItemFilterContainer[],
}

const initialState: FeedState = {
    feed: [],
    witness: Symbol(),
    filters: [],
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

const applyFilters = (filters: FeedItemFilterContainer[], item: Item): boolean => {
    try {
        if (filters.length === 0) {
            return true;
        }

        return filters.every((fc: FeedItemFilterContainer) => {
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

// export const useFilteredFeed = (): Item[] => {
//     return useGetFeed().filter((item: Item))
// }

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
    }
}

const _remove_filter = (state: FeedState, symbol: Symbol): FeedState => {
    let _filters: FeedItemFilterContainer[] = [];
    state.filters.forEach((f: FeedItemFilterContainer) => {
        if (f.symbol === symbol) {
            return;
        }
        _filters.push(f);
    });
    state.filters = _filters;
    return {
        ...state,
        filters: state.filters,
    }
}

const _push_filter = (state: FeedState, filter: FeedItemFilter, _symbol?: Symbol): FeedState => {
    let symbol = _symbol || Symbol();

    if (_symbol !== undefined) {
        _remove_filter(state, _symbol);
    }

    const fc: FeedItemFilterContainer = {
        symbol,
        filter: filter,
    };

    state.filters.push(fc);

    return {
        ...state,
        filters: state.filters,
    }
}

const _reset_filters = (state: FeedState): FeedState => {
    return {
        ...state,
        filters: [],
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
	setFeed: (payload: any) => ({
		payload,
		func: _set_feed,
    }),
    reloadFeed: () => ({
        payload: null,
        func: _reload_feed,
    }),
    addFilter: (payload: any) => ({
        payload,
        func: _push_filter,
    }),
    resetFilters: () => ({
        payload: null,
        func: _reset_filters,
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
    reloadFeed
} = actions

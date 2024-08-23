import { createContext, useContext, useReducer } from "react";
import { Item } from "src/entity/item";

type FeedState = {
    feed: Item[],
    witness: Symbol,
}

const initialState: FeedState = {
    feed: [],
    witness: Symbol(),
}

export const Context = createContext<[FeedState, React.Dispatch<Action>]>([initialState, () => {console.error("too soon to call feed dispatch")}])

/***********************   SELECTORS   ***********************/

export const useGetFeed = (): any => {
	const [{ feed }] = useContext(Context)
    return feed;
}

export const useReloadFeed = (): any => {
	const [{ witness }] = useContext(Context)
    return witness;
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

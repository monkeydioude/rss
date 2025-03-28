import { createContext, useContext, useReducer } from "react";

export type RefreshState = {
    lastRefresh: number,
    method : "manual" | "auto",
}

const initialState: RefreshState = {
    lastRefresh: 0,
    method: "auto",
}

export const Context = createContext<[RefreshState, React.Dispatch<Action>]>([initialState, () => { console.error("too soon to call config dispatch") }])

/***********************   SELECTORS   ***********************/

export const useRefresh = (): RefreshState => {
    const [state] = useContext(Context);
    return state;
}

/***********************   REDUCERS   ***********************/

export type Action = {
    payload?: any
    func: (state: RefreshState, any?: any) => RefreshState
}

const _setLastRefresh = (state: RefreshState, payload: Partial<RefreshState>): RefreshState => {
    if (!payload)
        return (state);
    return {
        ...state,
        ...payload,
    }
}

const reducer = (state: RefreshState, action: Action): RefreshState => {
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
    setLastRefresh: (payload: Partial<RefreshState>) => ({
        payload,
        func: _setLastRefresh,
    }),
}

/***********************   CONTEXT   ***********************/

const RefreshProvider = ({ children }: { children: React.ReactNode }) => {
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

export default RefreshProvider

export const {
    setLastRefresh,
} = actions

import { createContext, useContext, useReducer } from "react";

export type UserState = {
    username: string,
}

const initialState: UserState = {
    username: "",
}

export const Context = createContext<[UserState, React.Dispatch<Action>]>([initialState, () => { console.error("too soon to call config dispatch") }])

/***********************   SELECTORS   ***********************/

export const useUser = (): UserState => {
    const [state] = useContext(Context);
    return state;
}

/***********************   REDUCERS   ***********************/

export type Action = {
    payload?: any
    func: (state: UserState, any?: any) => UserState
}

const _set_user = (state: UserState, partialUser: Partial<UserState>): UserState => {
    if (!partialUser)
        return (state);
    return {
        ...state,
        ...partialUser,
    }
}

const reducer = (state: UserState, action: Action): UserState => {
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
    setUser: (payload: Partial<UserState>) => ({
        payload,
        func: _set_user,
    }),
}

/***********************   CONTEXT   ***********************/

const UserProvider = ({ children }: { children: React.ReactNode }) => {
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

export default UserProvider

export const {
    setUser,
} = actions

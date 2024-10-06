import { createContext, useContext, useReducer } from "react";
import { IdentityToken } from "./types";

export enum AuthState {
    CONNECTING = 0,
    SIGNED_IN = 1,
    SIGNED_OUT = 2,
}

type State = {
    token: IdentityToken | null,
    authState: AuthState,
    rand: number,
}

const initialState: State = {
    token: null,
    authState: AuthState.CONNECTING,
    rand: Math.random(),
}

export const Context = createContext<[State, React.Dispatch<Action>]>([initialState, () => { console.error("too soon to call identity dispatch") }])

/***********************   SELECTORS   ***********************/

export const useIsAuthentified = (): boolean => {
    const [{ token, authState }] = useContext(Context);
    return token !== null && authState == AuthState.SIGNED_IN;
}

export const useIsSignedOut = (): boolean => {
    const [{ authState }] = useContext(Context);
    return authState == AuthState.SIGNED_OUT;
}

export const useIsSignedIn = (): boolean => {
    const [{ authState }] = useContext(Context);
    return authState == AuthState.SIGNED_IN;
}

export const useIsLoading = (): boolean => {
    const [{ authState }] = useContext(Context);
    return authState == AuthState.CONNECTING;
}

export const useToken = (): IdentityToken | null => {
    const [{ token }] = useContext(Context);
    return token;
}

/***********************   REDUCERS   ***********************/

export type Action = {
    payload: any
    func: (state: State, any: any) => State
}


const _set_token = (state: State, token: IdentityToken | null): State => {
    return {
        ...state,
        token,
        authState: token == null ? AuthState.SIGNED_OUT : AuthState.SIGNED_IN,
    }
}

const reducer = (state: State, action: Action): State => {
    try {
        return action.func(state, action.payload);
    } catch (err) {
        console.error("identity reducer", err);
    }
    return state
}

const actions = {
    setToken: (payload: IdentityToken | null) => ({
        payload,
        func: _set_token,
    })
}

/***********************   CONTEXT   ***********************/

const IdentityProvider = ({ children }: { children: React.ReactNode }) => {
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

export default IdentityProvider

export const {
    setToken,
} = actions

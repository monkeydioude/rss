import { createContext, useContext, useReducer } from "react";
import appConfig, { ChannelTitleMode } from "src/appConfig";
import { ConfigStorage } from "src/storages/custom";

export type ConfigState = {
    displayChannelTitle: ChannelTitleMode,
    maxItemPerFeed: number,
    displayCategories: boolean,
    maxAmntCategories: number,
}   

const initialState: ConfigState = {
    displayChannelTitle: appConfig.displayChannelTitle,
    maxItemPerFeed: appConfig.maxItemPerFeed,
    displayCategories: appConfig.displayCategories,
    maxAmntCategories: appConfig.maxAmntCategories,
}

export const Context = createContext<[ConfigState, React.Dispatch<Action>]>([initialState, () => {console.error("too soon to call config dispatch")}])

/***********************   SELECTORS   ***********************/

export const useConfig = (): ConfigState => {
    const [ state ] = useContext(Context);
    return state;
}

/***********************   REDUCERS   ***********************/

export type Action = {
    payload: any
    func: (state: ConfigState, any: any) => ConfigState
}

const _init_config = (state: ConfigState, partialConfig: Partial<ConfigState>): ConfigState => {
    if (!partialConfig)
        return (state);
    return {
        ...state,
        ...partialConfig,
    }
}

const _update_config = (state: ConfigState, partialConfig: Partial<ConfigState>): ConfigState => {
    if (!partialConfig)
        return (state);
    state = {
        ...state,
        ...partialConfig,
    }
    ConfigStorage.update(state);
    return { ...state }
}

const reducer = (state: ConfigState, action: Action): ConfigState => {
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
    initConfig: (payload: Partial<ConfigState>) => ({
        payload,
        func: _init_config,
    }),
    updateConfig: (payload: Partial<ConfigState>) => ({
        payload,
        func: _update_config,
    }),
}

/***********************   CONTEXT   ***********************/

const ConfigProvider = ({ children }: { children: React.ReactNode}) => {
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

export default ConfigProvider

export const {
    initConfig,
    updateConfig
} = actions

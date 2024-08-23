import { createContext, useContext, useReducer } from "react";
import { Channel } from "src/entity/channel";
import { ChannelStorage } from "src/storages/custom";
import { Mapp } from "src/storages/map_storage";

type State = {
    channels: Mapp<number, Channel>,
}

const initialState: State = {
    channels: new Mapp<number, Channel>(),
}

export const Context = createContext<[State, React.Dispatch<Action>]>([initialState, () => {console.error("too soon to call channels dispatch")}])

/***********************   SELECTORS   ***********************/

export const useChannels = (): Mapp<number, Channel> => {
    const [{ channels }] = useContext(Context);
    return channels;
}

export const useChannelIDs = (): number[] => {
    const channels = useChannels();
    return Array.from(channels.keys());
}


/***********************   REDUCERS   ***********************/

export type Action = {
    payload: any
    func: (state: State, any: any) => State
}

const _set_channels = (state: State, channels: Mapp<number, Channel>): State => {
    if (!channels)
        return (state);
    return {
        ...state,
        // Have to send a new Mapp, else state checker won't notice the difference in the state
        channels: new Mapp(channels),
    }
}

const _add_channel = (state: State, channel: [number, Channel]): State => {
    if (!channel || state.channels?.has(channel[0])) {
        return state;
    }
    ChannelStorage.push(channel[0], channel[1]);
    state.channels.set(channel[0], channel[1]);
    return {
        ...state,
        // Have to send a new Mapp, else state checker won't notice the difference in the state
        channels: new Mapp(state.channels)
    }
}

const reducer = (state: State, action: Action): State => {
    try {
        if (action.func) {
            return action.func(state, action.payload);
        }
    } catch (err) {
        console.error("channels reducer", err);
    }
    return state
}
const actions = {
    addChannel: (payload: [number, Channel]) => ({
        payload,
        func: _add_channel,
    }),
    setChannels: (payload: Mapp<number, Channel>) => ({
        payload,
        func: _set_channels,
    })
}

/***********************   CONTEXT   ***********************/

const ChannelsProvider = ({ children }: { children: React.ReactNode}) => {
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

export default ChannelsProvider

export const {
    addChannel,
    setChannels,
} = actions

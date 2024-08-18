import { createContext, useContext, useReducer } from "react";
import appConfig from "src/appConfig";
import { Storage } from "src/services/data_storage";

type State = {
  ids: Map<number, string>,
}

const initialState: State = {
  ids: new Map<number, string>(),
}

export const Context = createContext<[State, React.Dispatch<Action>]>([initialState, () => {console.error("too soon to call channels dispatch")}])

/***********************   SELECTORS   ***********************/

export const useChannelIDs = (): Map<number, string> => {
  const [{ ids }] = useContext(Context)
  return ids
}


/***********************   REDUCERS   ***********************/

export type Action = {
  type: string
  payload: any
}

const reducer = (state: State, action: Action): State => {
  try {
    switch (action.type) {
      case "ADD_CHANNEL":
        const channel_id_name = action.payload as [number, string];
        if (!channel_id_name || state.ids?.has(channel_id_name[0])) {
          return state;
        }
        state.ids.set(channel_id_name[0], channel_id_name[1]);
        (new Storage(appConfig.storageKeys.channel_ids)).insert(JSON.stringify(Array.from(state.ids.entries())))
        return { ...state }
      case "SET_CHANNELS":
        if (!action.payload)
          return (state);
        return {
          ...state,
          ids: action.payload as Map<number, string>,
        }
    }
  } catch (err) {
    console.error(err);
  }
  return state
}
const actions = {
  addChannel: (payload: [number, string]) => ({
    type: "ADD_CHANNEL",
    payload,
  }),
  setChannels: (payload: Map<number, string>) => ({
    type: "SET_CHANNELS",
    payload,
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

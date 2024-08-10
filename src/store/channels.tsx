import { createContext, useContext, useReducer } from "react";
import appConfig from "src/appConfig";
import { Storage } from "src/service/data_storage";

type State = {
  ids: number[],
}

const initialState: State = {
  ids: [],
}

export const Context = createContext<[State, React.Dispatch<Action>]>([initialState, () => {console.error("too soon to call dispatch")}])

/***********************   SELECTORS   ***********************/

export const useChannelIDs = (): number[] => {
  const [{ ids }] = useContext(Context)
  return ids
}


/***********************   REDUCERS   ***********************/

export type Action = {
  type: string
  payload: any
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_CHANNEL":
      const channel_id = action.payload as number;
      if (state.ids.indexOf(channel_id) > -1) {
        return state;
      }
      state.ids.push(action.payload as number);
      (new Storage(appConfig.storageKeys.channel_ids)).insert(JSON.stringify(state.ids))
      return { ...state }
      case "SET_CHANNELS":
        return {
          ...state,
          ids: action.payload as number[],
        }
  }
  return state
}
const actions = {
  addChannel: (payload: number) => ({
    type: "ADD_CHANNEL",
    payload,
  }),
  setChannels: (payload: number) => ({
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

import { createContext, useContext, useReducer } from "react";
import { Item } from "src/entity/item";

type State = {
  feed: Item[],
}

const initialState: State = {
  feed: [],
}

export const Context = createContext<[State, React.Dispatch<Action>]>([initialState, () => {console.error("too soon to call feed dispatch")}])

/***********************   SELECTORS   ***********************/

export const useFeed = (): any => {
  const [{ feed }] = useContext(Context)
  return feed
}


/***********************   REDUCERS   ***********************/

export type Action = {
  type: string
  payload: any
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FEED":
        return {
          ...state,
          feed: action.payload,
        }
  }
  return state
}
const actions = {
  setFeed: (payload: any) => ({
    type: "SET_FEED",
    payload,
  }),
}

// const _actions: Record<keyof State, Record<string, ((payload: any, state: State) => any)|boolean>> = {
//   feed: {
//     setFeed: (payload: any) => payload,
//   },
// }


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
} = actions

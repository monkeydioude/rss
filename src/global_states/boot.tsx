import { createContext, useContext, useEffect, useReducer } from "react";
import useBoot from "src/hooks/useBoot";

type State = {
  isBooted: boolean,
}

const initialState: State = {
  isBooted: false,
}

export const Context = createContext<[State, React.Dispatch<Action>]>([initialState, () => {console.error("too soon to call boot dispatch")}])

/***********************   SELECTORS   ***********************/

export const useIsBooted = (): boolean => {
  const [{ isBooted }] = useContext(Context)
  return isBooted
}


/***********************   REDUCERS   ***********************/

export type Action = {
  type: string
  payload: any
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_IS_BOOTED":
        return {
          ...state,
          isBooted: action.payload,
        }
  }
  return state
}
const actions = {
  setIsBooted: (payload: any) => ({
    type: "SET_IS_BOOTED",
    payload,
  }),
}

/***********************   CONTEXT   ***********************/

const BootProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const bootDone = useBoot();

    useEffect(() => {
        dispatch(setIsBooted(bootDone))
  }, [bootDone])

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

export default BootProvider

export const {
  setIsBooted,
} = actions

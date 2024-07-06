import { createContext, useContext, useReducer } from "react";

type State = {
  auth: any,
  authenticating: boolean,
}

const initialState: State = {
  // Authentication user data as served by AWS Amplify / Cognito.
  auth: null,
  // Is 'true' if the user is currently authenticating
  authenticating: false,
}

export const Context = createContext<[State, React.Dispatch<Action>]>([initialState, () => {console.error("too soon to call dispatch")}])

/***********************   SELECTORS   ***********************/

export const useCurrentAuth = (): any => {
  const [{ auth }] = useContext(Context)
  return auth
}


/***********************   REDUCERS   ***********************/

export type Action = {
  type: string
  payload: any
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_AUTH":
        return {
          ...state,
          auth: action.payload,
        }
    case "SET_AUTHENTICATING":
      return {
        ...state,
        authenticating: action.payload,
      }
  }
  return state
}
const actions = {
  setCurrentAuth: (payload: any) => ({
    type: "SET_AUTH",
    payload,
  }),
  setCurrentUserIsAuthenticating: (payload: boolean) => ({
    type: "SET_AUTHENTICATING",
    payload,
  }),
}

const _actions: Record<keyof State, Record<string, ((payload: any, state: State) => any)|boolean>> = {
  auth: {
    setCurrentAuth: (payload: any) => payload,
  },
  authenticating: {
    setCurrentUserIsAuthenticating: (payload: boolean) => payload,
  }
  // setCurrentAuth: (state: State, payload: any)
}


/***********************   CONTEXT   ***********************/

// const Provider = ({ children }: { children: React.ReactNode }) => {
//   const [state, dispatch] = useReducer(reducer, initialState)

//   return (
//     <Context.Provider value={[state, dispatch]}>
//       {children}
//     </Context.Provider>
//   )
// }

// export const useDispatch = (): React.Dispatch<Action> => {
//   const [_, dispatch] = useContext(Context)
//   return dispatch
// }
type Reducer<S,> = (state: S, payload: any) => S

const createActions = <T,S,>(actions: Record<keyof T, Record<string, ((payload: any, state: State) => any)|boolean>>): [

] => {

}

const createProvider = <S,>(
  initialState: any,
  reducer: Reducer<S>,
) => ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  )
}


export default createProvider(initialState)

export const {
  setCurrentAuth,
  setCurrentUserIsAuthenticating
} = actions

import React, { createContext, useContext, useReducer } from "react";
import { IUserMe } from "../../interfaces";

type AppState = {
  refresh: boolean;
  user: null | IUserMe;
};

type AppAction =
  | { type: "toggleRefresh" }
  | { type: "setUser"; payload: IUserMe | null };

type AppContextType = {
  appState: AppState;
  dispatch: React.Dispatch<AppAction>;
};

const initialAppState: AppState = {
  refresh: true,
  user: null,
};

const AppContext = createContext<AppContextType>({
  appState: initialAppState,
  dispatch: () => {
    throw new Error("Dispatch method not implemented");
  },
});

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "toggleRefresh":
      return {
        ...state,
        refresh: !state.refresh,
      };
    case "setUser":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appState, dispatch] = useReducer(appReducer, initialAppState);

  return (
    <AppContext.Provider value={{ appState, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// const AppContext = () => useContext(AppContext);

export { AppProvider, AppContext };

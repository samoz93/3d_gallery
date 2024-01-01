import { createContext, useContext, useMemo, useReducer } from "react";
import {
  Actions,
  CanvasContextType,
  CanvasReducer,
  DefaultCanvasContextValue,
} from "./CanvasReducer";

type ContextReducerType = [
  CanvasContextType,
  React.Dispatch<{
    type: Actions;
  }>
];

const AppContext = createContext<ContextReducerType>(null as any);

export function CanvasWrapper({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    CanvasReducer,
    DefaultCanvasContextValue
  );

  const contextValue = useMemo<ContextReducerType>(() => {
    return [state, dispatch];
  }, [state, dispatch]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
export function useCanvasContext(): ContextReducerType {
  return useContext(AppContext);
}

import { createContext } from "react";

type CanvasContextType = {
  bloom: {
    intensity: number;
    smoothing: number;
    threshold: number;
    disable: boolean;
  };
};

export const CanvasContext = createContext<CanvasContextType>({
  bloom: {
    intensity: 1.1,
    threshold: 0.4,
    smoothing: 0.1,
    disable: false,
  },
});

export const CanvasContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <CanvasContext.Provider
      value={{
        bloom: {
          intensity: 1.1,
          threshold: 0.4,
          smoothing: 0.1,
          disable: false,
        },
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

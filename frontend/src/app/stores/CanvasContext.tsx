import { createContext, useState } from "react";

type CanvasContextType = {
  bloom: {
    intensity: number;
    smoothing: number;
    threshold: number;
    disable: boolean;
  };
  camera: {
    disableOrbitControls: boolean;
  };
};

type ContextActions = {
  disableBloom: () => void;
  enableBloom: () => void;
  disableOrbitControls: () => void;
  enableOrbitControls: () => void;
};

export const CanvasContext = createContext<CanvasContextType & ContextActions>({
  bloom: {
    intensity: 1.1,
    threshold: 0.4,
    smoothing: 0.1,
    disable: false,
  },
  camera: {
    disableOrbitControls: false,
  },
});

export const CanvasContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<CanvasContextType>({
    bloom: {
      intensity: 1.1,
      threshold: 0.4,
      smoothing: 0.1,
      disable: false,
    },
    camera: {
      disableOrbitControls: false,
    },
  });

  const ctx = {
    ...state,
    disableBloom: () =>
      setState((state) => ({
        ...state,
        bloom: {
          ...state.bloom,
          disable: true,
        },
      })),
    disableOrbitControls: () => {
      setState((state) => ({
        ...state,
        camera: {
          ...state.camera,
          disableOrbitControls: true,
        },
      }));
    },
    enableOrbitControls: () => {
      setState((state) => ({
        ...state,
        camera: {
          ...state.camera,
          disableOrbitControls: false,
        },
      }));
    },
    enableBloom: () =>
      setState((state) => ({
        ...state,
        bloom: {
          ...state.bloom,
          disable: false,
        },
      })),
  };
  return (
    <CanvasContext.Provider value={ctx}>{children}</CanvasContext.Provider>
  );
};

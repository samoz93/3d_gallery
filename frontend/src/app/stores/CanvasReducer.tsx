export const DefaultCanvasContextValue = {
  bloom: {
    intensity: 1.1,
    threshold: 0.4,
    smoothing: 0.1,
    disable: false,
  },
  camera: {
    disableOrbitControls: false,
  },
};

export type Actions =
  | "DISABLE_BLOOM"
  | "ENABLE_BLOOM"
  | "DISABLE_ORBIT_CONTROLS"
  | "ENABLE_ORBIT_CONTROLS";

export const CanvasReducer = (
  state: CanvasContextType,
  action: { type: Actions }
) => {
  switch (action.type) {
    case "DISABLE_BLOOM":
      return {
        ...state,
        bloom: {
          ...state.bloom,
          disable: true,
        },
      };
    case "ENABLE_BLOOM":
      return {
        ...state,
        bloom: {
          ...state.bloom,
          disable: false,
        },
      };
    case "DISABLE_ORBIT_CONTROLS":
      return {
        ...state,
        camera: {
          ...state.camera,
          disableOrbitControls: true,
        },
      };
    case "ENABLE_ORBIT_CONTROLS":
      return {
        ...state,
        camera: {
          ...state.camera,
          disableOrbitControls: false,
        },
      };
    default:
      return state;
  }
};

export type CanvasContextType = {
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

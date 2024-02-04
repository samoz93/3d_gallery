import { create } from "zustand";

type BloomConfig = {
  intensity: number;
  smoothing: number;
  threshold: number;
  disable: boolean;
};
type FieldConfig = {
  showPlane: boolean;
  enableOrbit: boolean;
  perspective: boolean;
};
type StoreType = {
  bloom: BloomConfig;
  filed: FieldConfig;
};

type Actions = {
  updateBloom: (bloom: Partial<BloomConfig>) => void;
  updateField: (filed: Partial<FieldConfig>) => void;
  restoreDefault: () => void;
};

export const zDefaults = {
  bloom: {
    intensity: 0.5,
    smoothing: 0.5,
    threshold: 0.5,
    disable: false,
  },
  filed: {
    showPlane: true,
    enableOrbit: true,
    perspective: true,
  },
};
export const useZStore = create<Actions & StoreType>((set) => ({
  ...zDefaults,
  updateBloom: (bloom) =>
    set((state) => ({
      ...state,
      bloom: {
        ...state.bloom,
        ...bloom,
      },
    })),
  updateField: (filed) =>
    set((state) => ({
      ...state,
      filed: {
        ...state.filed,
        ...filed,
      },
    })),
  restoreDefault: () => set(zDefaults),
}));

import { create } from "zustand";

type BloomConfig = {
  intensity: number;
  smoothing: number;
  threshold: number;
  disable: boolean;
};
type FieldConfig = {
  showPlane: boolean;
};
type StoreType = {
  bloom: BloomConfig;
  filed: FieldConfig;
};

type Actions = {
  updateBloom: (bloom: BloomConfig) => void;
  updateField: (bloom: FieldConfig) => void;
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
  },
};
export const useZStore = create<Actions & StoreType>((set) => ({
  ...zDefaults,
  updateBloom: (bloom) => set((state) => ({ ...state, bloom })),
  updateField: (filed) => set((state) => ({ ...state, filed })),
  restoreDefault: () => set(zDefaults),
}));

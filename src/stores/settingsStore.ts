import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  crtFilter: boolean;
  soundEnabled: boolean;
  metricsEnabled: boolean;
  toggleCrt: () => void;
  toggleSound: () => void;
  toggleMetrics: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      crtFilter: true,
      soundEnabled: true,
      metricsEnabled: true,
      toggleCrt: () => set((s) => ({ crtFilter: !s.crtFilter })),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleMetrics: () => set((s) => ({ metricsEnabled: !s.metricsEnabled })),
    }),
    { name: 'xenogotchi-settings' }
  )
);

import { Duo } from "@/data/duoData";
import { create, StateCreator } from "zustand";
import { withAsyncStoragePersist } from "./middleware";

interface DuoStore {
  duos: Duo[];
  addDuo: (playerIds: string[]) => Duo;
  updateDuo: (id: string, duo: Partial<Duo>) => void;
  removeDuo: (id: string) => void;
  getDuoById: (id: string) => Duo | undefined;
  importDuos: (duos: Duo[]) => void;
}

const duoStoreCreator: StateCreator<DuoStore> = (set, get) => ({
  duos: [],
  addDuo: (playerIds: string[]) => {
    const newDuo: Duo = {
      id: playerIds.join("-"),
      playerIds,
      wins: 0,
      losses: 0,
    };
    set((state: DuoStore) => ({ duos: [...state.duos, newDuo] }));
    return newDuo;
  },
  updateDuo: (id: string, duo: Partial<Duo>) =>
    set((state: DuoStore) => ({
      duos: state.duos.map((d: Duo) => (d.id === id ? { ...d, ...duo } : d)),
    })),
  removeDuo: (id: string) =>
    set((state: DuoStore) => ({
      duos: state.duos.filter((d: Duo) => d.id !== id),
    })),
  getDuoById: (id: string) => get().duos.find((d: Duo) => d.id === id),
  importDuos: (duos: Duo[]) => set({ duos }),
});

export const useDuoStore = create<DuoStore>()(
  withAsyncStoragePersist(duoStoreCreator, {
    name: "duo-store",
  })
);

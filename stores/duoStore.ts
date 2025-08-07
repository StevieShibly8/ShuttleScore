import { Duo } from "@/data/duoData";
import uuid from "react-native-uuid";
import { create, StateCreator } from "zustand";
import { withAsyncStoragePersist } from "./middleware";

interface DuoStore {
  duos: Duo[];
  addDuo: (playerIds: string[]) => void;
  updateDuo: (id: string, duo: Partial<Duo>) => void;
  removeDuo: (id: string) => void;
}

const duoStoreCreator: StateCreator<DuoStore> = (set, get) => ({
  duos: [],
  addDuo: (playerIds: string[]) => {
    const newDuo: Duo = {
      id: uuid.v4() as string,
      playerIds,
      wins: 0,
      losses: 0,
    };
    set((state: DuoStore) => ({ duos: [...state.duos, newDuo] }));
  },
  updateDuo: (id: string, duo: Partial<Duo>) =>
    set((state: DuoStore) => ({
      duos: state.duos.map((d: Duo) => (d.id === id ? { ...d, ...duo } : d)),
    })),
  removeDuo: (id: string) =>
    set((state: DuoStore) => ({
      duos: state.duos.filter((d: Duo) => d.id !== id),
    })),
});

export const useDuoStore = create<DuoStore>()(
  withAsyncStoragePersist(duoStoreCreator, {
    name: "duo-store",
  })
);

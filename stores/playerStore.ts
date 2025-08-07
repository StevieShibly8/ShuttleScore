import { Player } from "@/data/playerData";
import uuid from "react-native-uuid";
import { create, StateCreator } from "zustand";
import { withAsyncStoragePersist } from "./middleware";

interface PlayerStore {
  players: Player[];
  addPlayer: (name: string) => void;
  updatePlayer: (id: string, player: Partial<Player>) => void;
  removePlayer: (id: string) => void;
}

const playerStoreCreator: StateCreator<PlayerStore> = (set, get) => ({
  players: [],
  addPlayer: (name: string) => {
    const newPlayer: Player = {
      id: uuid.v4() as string,
      name,
      wins: 0,
      losses: 0,
      rank: 1,
      rating: 0,
    };
    set((state: PlayerStore) => ({ players: [...state.players, newPlayer] }));
  },
  updatePlayer: (id: string, player: Partial<Player>) =>
    set((state: PlayerStore) => ({
      players: state.players.map((p: Player) =>
        p.id === id ? { ...p, ...player } : p
      ),
    })),
  removePlayer: (id: string) =>
    set((state: PlayerStore) => ({
      players: state.players.filter((p: Player) => p.id !== id),
    })),
});

export const usePlayerStore = create<PlayerStore>()(
  withAsyncStoragePersist(playerStoreCreator, {
    name: "player-store",
  })
);

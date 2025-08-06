import { players as initialPlayers, Player } from "@/data/playerData";
import { create, StateCreator } from "zustand";
import withAsyncStoragePersist from "./middleware";

interface PlayerStore {
  players: Player[];
  addPlayer: (name: string) => void;
  updatePlayerStats: (id: string, wins: number, losses: number) => void;
  removePlayer: (id: string) => void;
}

const playerStoreCreator: StateCreator<PlayerStore> = (set, get) => ({
  players: initialPlayers,
  addPlayer: (name: string) => {
    // Generate a unique 4-digit string id
    const id = Math.floor(1000 + Math.random() * 9000).toString();
    const newPlayer: Player = {
      id,
      name,
      wins: 0,
      losses: 0,
    };
    set((state: PlayerStore) => ({ players: [...state.players, newPlayer] }));
  },
  updatePlayerStats: (id: string, wins: number, losses: number) =>
    set((state: PlayerStore) => ({
      players: state.players.map((p: Player) =>
        p.id === id ? { ...p, wins, losses } : p
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

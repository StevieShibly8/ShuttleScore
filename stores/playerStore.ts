import { Player } from "@/data/playerData";
import uuid from "react-native-uuid";
import { create, StateCreator } from "zustand";
import { withAsyncStoragePersist } from "./middleware";

interface PlayerStore {
  players: Player[];
  addPlayer: (name: string) => Player;
  updatePlayer: (id: string, player: Partial<Player>) => void;
  removePlayer: (id: string) => void;
  getPlayerById: (id: string) => Player | undefined;
  importPlayers: (players: Player[]) => void;
}

const playerStoreCreator: StateCreator<PlayerStore> = (set, get) => ({
  players: [],
  addPlayer: (name: string) => {
    const newPlayer: Player = {
      id: uuid.v4() as string,
      name,
      wins: 0,
      losses: 0,
      rp: 0,
    };
    set((state: PlayerStore) => ({
      players: [...state.players, newPlayer].sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    }));
    return newPlayer;
  },
  updatePlayer: (id: string, player: Partial<Player>) =>
    set((state: PlayerStore) => ({
      players: state.players
        .map((p: Player) => (p.id === id ? { ...p, ...player } : p))
        .sort((a, b) => a.name.localeCompare(b.name)),
    })),
  removePlayer: (id: string) =>
    set((state: PlayerStore) => ({
      players: state.players.filter((p: Player) => p.id !== id),
    })),
  getPlayerById: (id: string) => get().players.find((p: Player) => p.id === id),
  importPlayers: (players: Player[]) =>
    set({
      players: [...players].sort((a, b) => a.name.localeCompare(b.name)),
    }),
});

export const usePlayerStore = create<PlayerStore>()(
  withAsyncStoragePersist(playerStoreCreator, {
    name: "player-store",
  })
);

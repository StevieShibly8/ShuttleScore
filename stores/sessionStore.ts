import { Session } from "@/data/sessionData";
import uuid from "react-native-uuid";
import { create, StateCreator } from "zustand";
import { withAsyncStoragePersist } from "./middleware";

interface SessionStore {
  sessions: Session[];
  addSession: (playerIds: string[]) => void;
  updateSession: (id: string, session: Partial<Session>) => void;
  removeSession: (id: string) => void;
}

const sessionStoreCreator: StateCreator<SessionStore> = (set, get) => ({
  sessions: [],
  addSession: (playerIds: string[]) => {
    const newSession: Session = {
      id: uuid.v4() as string,
      playerIds,
      date: new Date().toISOString(),
      pastGames: [],
      currentGame: null,
      gamesPlayedPerPlayer: {},
      gamesPlayedPerDuo: {},
      consecutiveGamesPlayedPerPlayer: {},
      gamesWonPerPlayer: {},
      gamesWonPerDuo: {},
      isSessionActive: true,
    };
    set((state: SessionStore) => ({
      sessions: [...state.sessions, newSession],
    }));
  },
  updateSession: (id: string, session: Partial<Session>) =>
    set((state: SessionStore) => ({
      sessions: state.sessions.map((s: Session) =>
        s.id === id ? { ...s, ...session } : s
      ),
    })),
  removeSession: (id: string) =>
    set((state: SessionStore) => ({
      sessions: state.sessions.filter((s: Session) => s.id !== id),
    })),
});

export const useSessionStore = create<SessionStore>()(
  withAsyncStoragePersist(sessionStoreCreator, {
    name: "session-store",
  })
);

import { Game, Team } from "@/data/gameData";
import { Session } from "@/data/sessionData";
import uuid from "react-native-uuid";
import { create, StateCreator } from "zustand";
import { withAsyncStoragePersist } from "./middleware";

interface SessionStore {
  sessions: Session[];
  addSession: (playerIds: string[]) => Session;
  updateSession: (id: string, session: Partial<Session>) => void;
  removeSession: (id: string) => void;
  getSessionById: (id: string) => Session | undefined;
  getCurrentSession: () => Session | undefined;
  addGameToSession: (sessionId: string, teamA: Team, teamB: Team) => Game;
  getGameById: (sessionId: string, gameId: string) => Game | undefined;
  getCurrentGame: (sessionId: string) => Game | undefined;
  endSession: (id: string) => void;
}

const sessionStoreCreator: StateCreator<SessionStore> = (set, get) => ({
  sessions: [],
  addSession: (playerIds: string[]) => {
    const newSession: Session = {
      id: uuid.v4() as string,
      playerIds,
      date: new Date().toLocaleString(),
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
    return newSession;
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
  getSessionById: (id: string) =>
    get().sessions.find((s: Session) => s.id === id),
  getCurrentSession: () =>
    get().sessions.find((s: Session) => s.isSessionActive),
  addGameToSession: (sessionId: string, teamA: Team, teamB: Team) => {
    const newGame = {
      id: uuid.v4() as string,
      teamA,
      teamB,
      isGameActive: true,
    };
    set((state: SessionStore) => ({
      sessions: state.sessions.map((s: Session) =>
        s.id === sessionId ? { ...s, currentGame: newGame } : s
      ),
    }));
    return newGame;
  },
  getGameById: (sessionId: string, gameId: string) => {
    const session = get().getSessionById(sessionId);
    return session?.pastGames.find((game) => game.id === gameId);
  },
  getCurrentGame: (sessionId: string) => {
    const session = get().getSessionById(sessionId);
    return session?.currentGame ?? undefined;
  },
  endSession: (id: string) => {
    const session = get().getSessionById(id);
    if (!session) return;

    let updatedPastGames = session.pastGames;
    let updatedCurrentGame = session.currentGame;

    if (session.currentGame && session.currentGame.isGameActive) {
      const endedGame = { ...session.currentGame, isGameActive: false };
      updatedPastGames = [...session.pastGames, endedGame];
      updatedCurrentGame = null;
    }

    get().updateSession(id, {
      isSessionActive: false,
      currentGame: updatedCurrentGame,
      pastGames: updatedPastGames,
    });
  },
});

export const useSessionStore = create<SessionStore>()(
  withAsyncStoragePersist(sessionStoreCreator, {
    name: "session-store",
  })
);

import { Game, Team } from "@/data/gameData";
import { Session } from "@/data/sessionData";
import uuid from "react-native-uuid";
import { create, StateCreator } from "zustand";
import { withAsyncStoragePersist } from "./middleware";

interface SessionStore {
  sessions: Session[];
  addSession: (playerIds: string[], duoIds: string[]) => Session;
  updateSession: (id: string, session: Partial<Session>) => void;
  removeSession: (id: string) => void;
  getSessionById: (id: string) => Session | undefined;
  getCurrentSession: () => Session | undefined;
  endSession: (id: string) => void;
  addGameToSession: (sessionId: string, teamA: Team, teamB: Team) => Game;
  getGameById: (sessionId: string, gameId: string) => Game | undefined;
  getCurrentGame: (sessionId: string) => Game | undefined;
  endCurrentGame: (sessionId: string, isGameCompleted: boolean) => void;
}

const sessionStoreCreator: StateCreator<SessionStore> = (set, get) => ({
  sessions: [],
  addSession: (playerIds: string[], duoIds: string[]) => {
    const gamesPlayedPerPlayer: Record<string, number> = {};
    const gamesPlayedPerDuo: Record<string, number> = {};
    const gamesWonPerPlayer: Record<string, number> = {};
    const gamesWonPerDuo: Record<string, number> = {};

    playerIds.forEach((pid) => {
      gamesPlayedPerPlayer[pid] = 0;
      gamesWonPerPlayer[pid] = 0;
    });

    duoIds.forEach((did) => {
      gamesPlayedPerDuo[did] = 0;
      gamesWonPerDuo[did] = 0;
    });

    const newSession: Session = {
      id: uuid.v4() as string,
      playerIds,
      duoIds,
      date: new Date().toLocaleString(),
      pastGames: [],
      currentGame: null,
      gamesPlayedPerPlayer,
      gamesPlayedPerDuo,
      gamesWonPerPlayer,
      gamesWonPerDuo,
      priorityPickPlayerIds: [],
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
    get().updateSession(sessionId, { currentGame: newGame });
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
  endCurrentGame: (sessionId: string, isGameCompleted: boolean) => {
    const session = get().getSessionById(sessionId);
    if (!session || !session.currentGame) return;

    const update: Partial<Session> = { currentGame: null };

    if (isGameCompleted) {
      const endedGame = { ...session.currentGame, isGameActive: false };
      update.pastGames = [...session.pastGames, endedGame];
    }

    get().updateSession(sessionId, update);
  },
});

export const useSessionStore = create<SessionStore>()(
  withAsyncStoragePersist(sessionStoreCreator, {
    name: "session-store",
  })
);

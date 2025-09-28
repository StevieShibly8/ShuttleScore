import { Game, Team } from "@/data/gameData";
import { Session } from "@/data/sessionData";
import uuid from "react-native-uuid";
import { create, StateCreator } from "zustand";
import { withAsyncStoragePersist } from "./middleware";

interface SessionStore {
  sessions: Session[];
  addSession: (
    playerIds: string[],
    duoIds: string[],
    sessionDuration: number
  ) => Session;
  updateSession: (id: string, session: Partial<Session>) => void;
  removeSession: (id: string) => void;
  getSessionById: (id: string) => Session | undefined;
  getCurrentSession: () => Session | undefined;
  endSession: (id: string) => void;
  addGameToSession: (
    sessionId: string,
    teamA: Team,
    teamB: Team,
    gamePoint: number,
    pointCap: number,
    gameType: string
  ) => Game;
  getGameById: (sessionId: string, gameId: string) => Game | undefined;
  getCurrentGame: (sessionId: string) => Game | undefined;
  endCurrentGame: (sessionId: string, isGameCompleted: boolean) => void;
  updatePlayerBenchStatus: (
    sessionId: string,
    playerId: string,
    isBenched: boolean
  ) => void;
  updatePlayerPaidStatus: (
    sessionId: string,
    playerId: string,
    paid: boolean
  ) => void;
  addPlayersToSession: (playerIds: string[], duoIds: string[]) => void;
  importSessions: (sessions: Session[]) => void;
}

const sessionStoreCreator: StateCreator<SessionStore> = (set, get) => ({
  sessions: [],
  addSession: (
    playerIds: string[],
    duoIds: string[],
    sessionDuration: number
  ) => {
    const gamesPlayedPerPlayer: Record<string, number> = {};
    const gamesPlayedPerDuo: Record<string, number> = {};
    const gamesWonPerPlayer: Record<string, number> = {};
    const gamesWonPerDuo: Record<string, number> = {};

    const players: Record<string, { isBenched: boolean; paid: boolean }> = {};
    playerIds.forEach((pid) => {
      players[pid] = { isBenched: false, paid: false };
      gamesPlayedPerPlayer[pid] = 0;
      gamesWonPerPlayer[pid] = 0;
    });

    duoIds.forEach((did) => {
      gamesPlayedPerDuo[did] = 0;
      gamesWonPerDuo[did] = 0;
    });

    const newSession: Session = {
      id: uuid.v4() as string,
      players,
      duoIds,
      date: new Date().toISOString(),
      pastGames: [],
      currentGame: null,
      gamesPlayedPerPlayer,
      gamesPlayedPerDuo,
      gamesWonPerPlayer,
      gamesWonPerDuo,
      isSessionActive: true,
      sessionDuration,
      miscCosts: [],
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
  addGameToSession: (
    sessionId: string,
    teamA: Team,
    teamB: Team,
    gamePoint: number,
    pointCap: number,
    gameType: string
  ) => {
    const newGame: Game = {
      id: uuid.v4() as string,
      teamA,
      teamB,
      isTeamSwapped: false,
      isTeamASwapped: false,
      isTeamBSwapped: false,
      server: "A",
      initialServer: "A",
      isGameActive: true,
      undoqueue: [],
      redoqueue: [],
      gamePoint,
      pointCap,
      gameType,
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
  updatePlayerBenchStatus: (
    sessionId: string,
    playerId: string,
    isBenched: boolean
  ) => {
    const session = get().getSessionById(sessionId);
    if (session && session.players[playerId]) {
      const updatedPlayers = {
        ...session.players,
        [playerId]: {
          ...session.players[playerId],
          isBenched,
        },
      };
      get().updateSession(sessionId, { players: updatedPlayers });
    }
  },
  updatePlayerPaidStatus: (
    sessionId: string,
    playerId: string,
    paid: boolean
  ) => {
    const session = get().getSessionById(sessionId);
    if (session && session.players[playerId]) {
      const updatedPlayers = {
        ...session.players,
        [playerId]: {
          ...session.players[playerId],
          paid,
        },
      };
      get().updateSession(sessionId, { players: updatedPlayers });
    }
  },
  addPlayersToSession: (playerIds: string[], duoIds: string[]) => {
    const session = get().getCurrentSession();
    if (!session) return;

    const updatedPlayers = { ...session.players };
    playerIds.forEach((pid) => {
      if (!updatedPlayers[pid]) {
        updatedPlayers[pid] = { isBenched: false, paid: false };
      }
    });

    const updatedDuoIds = Array.from(
      new Set([...(session.duoIds || []), ...duoIds])
    );

    const updatedGamesPlayedPerPlayer = { ...session.gamesPlayedPerPlayer };
    const updatedGamesWonPerPlayer = { ...session.gamesWonPerPlayer };
    playerIds.forEach((pid) => {
      if (!(pid in updatedGamesPlayedPerPlayer))
        updatedGamesPlayedPerPlayer[pid] = 0;
      if (!(pid in updatedGamesWonPerPlayer)) updatedGamesWonPerPlayer[pid] = 0;
    });

    const updatedGamesPlayedPerDuo = { ...session.gamesPlayedPerDuo };
    const updatedGamesWonPerDuo = { ...session.gamesWonPerDuo };
    duoIds.forEach((did) => {
      if (!(did in updatedGamesPlayedPerDuo)) updatedGamesPlayedPerDuo[did] = 0;
      if (!(did in updatedGamesWonPerDuo)) updatedGamesWonPerDuo[did] = 0;
    });

    get().updateSession(session.id, {
      players: updatedPlayers,
      duoIds: updatedDuoIds,
      gamesPlayedPerPlayer: updatedGamesPlayedPerPlayer,
      gamesWonPerPlayer: updatedGamesWonPerPlayer,
      gamesPlayedPerDuo: updatedGamesPlayedPerDuo,
      gamesWonPerDuo: updatedGamesWonPerDuo,
    });
  },

  importSessions: (sessions: Session[]) => set({ sessions }),
});

export const useSessionStore = create<SessionStore>()(
  withAsyncStoragePersist(sessionStoreCreator, {
    name: "session-store",
  })
);

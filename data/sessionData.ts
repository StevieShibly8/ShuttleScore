import { Game } from "./gameData";

export interface Session {
  id: string;
  playerIds: string[];
  date: string;
  pastGames: Game[];
  currentGame: Game | null;
  gamesPlayedPerPlayer: Record<string, number>;
  gamesPlayedPerDuo: Record<string, number>;
  consecutiveGamesPlayedPerPlayer: Record<string, number>;
  gamesWonPerPlayer: Record<string, number>;
  gamesWonPerDuo: Record<string, number>;
  isSessionActive: boolean;
}

import { Game } from "./gameData";
import { Player } from "./playerData";

export interface Session {
  id: string;
  players: Player[];
  pastGames: Game[];
  currentGame: Game | null;
  gamesPlayedPerPlayer: Record<string, number>;
  gamesPlayedPerDuo: Record<string, number>;
  consecutiveGamesPlayedPerPlayer: Record<string, number>;
  gamesWonPerPlayer: Record<string, number>;
  gamesWonPerDuo: Record<string, number>;
  isSessionActive: boolean;
}

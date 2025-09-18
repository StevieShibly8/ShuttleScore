import { Game } from "./gameData";

export interface Session {
  id: string;
  players: Record<string, { isBenched: boolean; paid: boolean }>;
  duoIds: string[];
  date: string;
  pastGames: Game[];
  currentGame: Game | null;
  gamesPlayedPerPlayer: Record<string, number>;
  gamesPlayedPerDuo: Record<string, number>;
  gamesWonPerPlayer: Record<string, number>;
  gamesWonPerDuo: Record<string, number>;
  priorityPickPlayerIds: string[];
  isSessionActive: boolean;
  sessionDuration: number;
  miscCosts: { label: string; amount: number }[];
}

import { Duo } from "./duoData";

interface Team {
  duo: Duo;
  score: number;
}

export interface Game {
  id: string;
  teamA: Team;
  teamB: Team;
  winner: Team | null;
  isGameActive: boolean;
}

export interface Team {
  id: string; // playerId for singles, duoId for doubles
  score: number;
}

export interface Game {
  id: string;
  teamA: Team;
  teamB: Team;
  isTeamSwapped: boolean;
  isTeamASwapped: boolean;
  isTeamBSwapped: boolean;
  server: "A" | "B";
  initialServer: "A" | "B";
  isGameActive: boolean;
  undoqueue: ("A" | "B")[];
  redoqueue: ("A" | "B")[];
  gamePoint: number;
  pointCap: number;
  gameType: string; // "singles" or "doubles"
}

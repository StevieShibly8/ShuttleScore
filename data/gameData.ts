export interface Team {
  duoId: string;
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
}

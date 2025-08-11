export interface Team {
  duoId: string;
  score: number;
}

export interface Game {
  id: string;
  teamA: Team;
  teamB: Team;
  isGameActive: boolean;
}

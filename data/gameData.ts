interface Team {
  duoId: string;
  score: number;
}

export interface Game {
  id: string;
  teamA: Team;
  teamB: Team;
  winner: "A" | "B" | null; // Use "A" or "B" to indicate the winning team
  isGameActive: boolean;
}

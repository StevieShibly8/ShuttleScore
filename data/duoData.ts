import { Player } from "./playerData";

export interface Duo {
  id: string;
  players: Player[];
  wins: number;
  losses: number;
  rank?: number;
}

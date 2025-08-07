export interface Player {
  id: string;
  name: string;
  wins: number;
  losses: number;
  email?: string;
  avatarUrl?: string;
  rank: number;
  rating: number;
}

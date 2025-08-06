export interface Player {
  id: string;
  name: string;
  wins: number;
  losses: number;
  email?: string;
  avatarUrl?: string;
  rank?: number;
  rating?: number;
}

export const players: Player[] = [
  { id: "1", name: "Zubair Shibly", wins: 15, losses: 3 },
  { id: "2", name: "Nilin Reza", wins: 12, losses: 5 },
  { id: "3", name: "Junaid Wali", wins: 10, losses: 7 },
  { id: "4", name: "Tawsif Hasan", wins: 8, losses: 9 },
  { id: "5", name: "Tahia Tasneem", wins: 6, losses: 11 },
  { id: "6", name: "Zerin Rumaly", wins: 5, losses: 13 },
  { id: "7", name: "Samin Zarif", wins: 4, losses: 14 },
  { id: "8", name: "Rownak Haider", wins: 3, losses: 15 },
];

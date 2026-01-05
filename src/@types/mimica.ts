// Mímica Master Types
export type MimicaCategory = 'P' | 'O' | 'A' | 'D' | 'L' | 'M';

export interface MimicaCard {
  id: number;
  word: string;
  category: MimicaCategory;
  points: number;
}

export interface Team {
  name: string;
  score: number;
  color: string;
}
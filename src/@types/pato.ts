// Nem a Pato Types
export interface PatoQuestion {
  question: string;
  answer: number;
}

export interface PatoCard {
  id: number;
  theme: string;
  duckValue: number;
  questions: PatoQuestion[];
}

export interface PatoPlayer {
  id: string;
  name: string;
  ducks: number;
}

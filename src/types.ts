export type Question = {
  id: number;
  text: string;
  answer: string;
  author: string;
};

export type Package = {
  id: number;
  title: string;
  questions: Question[];
  createdBy: string; // додано
};
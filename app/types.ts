export type Question = {
  question: string;
  options: string[];
  answer: string;
};

export type Quiz = {
  name: string;
  difficulty: string;
  image?: string;
  questions: Question[];
};

export type QuizData = {
  categories: Quiz[];
};
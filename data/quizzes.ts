export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

export const DAILY_QUIZ: QuizQuestion = {
  question: "What is the primary benefit of compounding interest?",
  options: [
    { text: "It pays out monthly cash dividends instantly", isCorrect: false },
    { text: "Your interest earns interest, accelerating growth over time", isCorrect: true },
    { text: "It prevents market stocks from ever losing value", isCorrect: false },
  ],
};

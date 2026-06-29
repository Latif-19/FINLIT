export interface AssessmentOption {
  text: string;
  score: number;
}

export interface AssessmentQuestion {
  question: string;
  options: AssessmentOption[];
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    question: "How do you track your daily expenses, including Mobile Money (MoMo) fees and E-levy?",
    options: [
      { text: "I don't track them at all", score: 1 },
      { text: "I track sometimes, but often ignore MoMo/E-levy fees", score: 2 },
      { text: "I record all expenses, including MoMo transaction costs", score: 3 },
    ],
  },
  {
    question: "Do you regularly save money?",
    options: [
      { text: "No, it's hard to save anything left over", score: 1 },
      { text: "Yes, occasionally in my MoMo wallet or bank account", score: 2 },
      { text: "Yes, a set amount every month, using automated saves", score: 3 },
    ],
  },
  {
    question: "Are you familiar with local investments in Ghana (e.g. Treasury Bills, Mutual Funds, GSE)?",
    options: [
      { text: "Not at all, I only know normal savings accounts", score: 1 },
      { text: "I've heard of T-Bills/Mutual Funds but don't know how to start", score: 2 },
      { text: "I actively invest in T-Bills or local mutual funds/stocks", score: 3 },
    ],
  },
  {
    question: "How prepared are you for an emergency (e.g. medical bill, urgent travel, laptop repair)?",
    options: [
      { text: "I'd have to borrow from friends or take a quick mobile loan", score: 1 },
      { text: "I have some cash put aside, but inflation eats into it", score: 2 },
      { text: "I have a dedicated emergency fund kept in a high-yield account", score: 3 },
    ],
  },
  {
    question: "What is your approach to borrowing money or digital loans (like Qwikloan, Fido, etc.)?",
    options: [
      { text: "I use quick mobile loans frequently for personal expenses", score: 1 },
      { text: "I only borrow when necessary, but find interest rates very high", score: 2 },
      { text: "I avoid high-interest digital loans and pay off debts promptly", score: 3 },
    ],
  },
];

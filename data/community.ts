export interface Reply {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  badge: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  badge: string;
  category: string;
  content: string;
  likes: number;
  likedByUser: boolean;
  createdAt: string;
  replies: Reply[];
}

export const COMMUNITY_CATEGORIES: string[] = ["All", "Savings", "Budgeting", "Investing", "Debt Free"];

export const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    author: "Sarah J.",
    handle: "@sarah_k",
    avatar: "🦊",
    badge: "Momo Saver",
    category: "Budgeting",
    content: "What is the best way to track transaction fees on MTN MoMo and Telecel Cash? Any spreadsheets or local app recommendations?",
    likes: 32,
    likedByUser: false,
    createdAt: "2h ago",
    replies: [
      {
        id: "rep-1-1",
        author: "Kojo A.",
        handle: "@kojo_sa",
        avatar: "🦉",
        badge: "Smart Saver",
        content: "I recommend withdrawing in larger sums rather than multiple small ones to reduce the flat fees, and keep an eye on E-levy exemptions.",
        createdAt: "1h ago",
      },
      {
        id: "rep-1-2",
        author: "Ama K.",
        handle: "@ama_finance",
        avatar: "🦁",
        badge: "Wealth Builder",
        content: "Check out the transaction cost calculator inside the Simulations tab! It maps out exactly what you pay in fees.",
        createdAt: "45m ago",
      },
    ],
  },
  {
    id: "post-2",
    author: "Mike D.",
    handle: "@mike_d",
    avatar: "🎓",
    badge: "Debt Free",
    category: "Debt Free",
    content: "Just paid off my Qwikloan debt today! The interest rates on those digital lending apps can get out of hand so quickly. Highly recommend clearing them first!",
    likes: 67,
    likedByUser: true,
    createdAt: "5h ago",
    replies: [
      {
        id: "rep-2-1",
        author: "John S.",
        handle: "@john_s",
        avatar: "🦅",
        badge: "Novice Explorer",
        content: "Huge congratulations! That must feel like a massive weight off your shoulders. Debt-free is the way to be.",
        createdAt: "4h ago",
      },
      {
        id: "rep-2-2",
        author: "Yaw B.",
        handle: "@yaw_tech",
        avatar: "🐸",
        badge: "Budgeting Hero",
        content: "Absolutely. I'm currently studying the 'Avoiding Digital Loan Traps' lesson in the Learn tab, super eye-opening.",
        createdAt: "3h ago",
      },
    ],
  },
  {
    id: "post-3",
    author: "Elena R.",
    handle: "@elena_gse",
    avatar: "🦉",
    badge: "T-Bill Pro",
    category: "Investing",
    content: "Which local Money Market Mutual Fund is offering the best yield this month? I want to store my hostel savings before next semester starts.",
    likes: 45,
    likedByUser: false,
    createdAt: "1d ago",
    replies: [
      {
        id: "rep-3-1",
        author: "David O.",
        handle: "@david_invests",
        avatar: "🐯",
        badge: "Wealth Builder Pro",
        content: "Databank MFund or EDC Money Market Fund are both solid. Rates are around 25-28% currently. Very low risk and good liquidity.",
        createdAt: "18h ago",
      },
      {
        id: "rep-3-2",
        author: "Naa L.",
        handle: "@naa_l",
        avatar: "🎓",
        badge: "Smart Manager",
        content: "Stanbic Cash Trust is also great. I use it to keep my school fees safe and separate from my spending account.",
        createdAt: "12h ago",
      },
    ],
  },
];

// ─── HOW TO ADD IMAGES & AUDIO ──────────────────────────────────────────────
// 1. Drop image files (png/jpg) into assets/images/ (e.g. lesson1-slide1.png)
// 2. Drop audio files (mp3) into assets/audio/ (e.g. lesson1.mp3)
// 3. In each lesson below, add:
//    - images: [require("../assets/images/lesson1-slide1.png"), require("../assets/images/lesson1-slide2.png")]
//      (one image per content slide, or fewer than content length)
//    - audioLocalPath: require("../assets/audio/lesson1.mp3")
// ─────────────────────────────────────────────────────────────────────────────

export interface LessonModule {
  id: number;
  title: string;
  desc: string;
  duration: string;
  xp: string;
  xpVal: number;
  content: string[];
  audioUrl?: string;
  audioLocalPath?: any; // require() path to local mp3
  images?: any[]; // require() paths to images shown inline with each slide
  emoji?: string;
}

export const LESSON_MODULES: LessonModule[] = [
  {
    id: 1,
    title: "MoMo Budgeting & Saving",
    desc: "Learn to track daily expenses, plan for E-levy/MoMo transaction fees, and save in mobile wallets.",
    duration: "10 min",
    xp: "100 XP",
    xpVal: 100,
    emoji: "📱",
    content: [
      "Mobile Money (MoMo) is the primary engine of personal finance in West Africa. Understanding how to manage fees is the first step toward building savings.",
      "1. Separate your pocket money from your savings. Use separate vault wallets like MTN MoMo Vault or Telecel Cash to restrict easy access to your money.",
      "2. Calculate transaction fees before sending. E-levy adds a 1% charge on daily transfers exceeding GH₵ 100. By keeping transfers below this limit or bundling them strategically, you can save significant transaction costs.",
      "3. Track your daily expenses. Keep a small log of cash-out fees. Even small GHS 5 withdrawal charges compound into hundreds of Ghana Cedis over the course of a year.",
    ],
  },
  {
    id: 2,
    title: "Avoiding Digital Debt Traps",
    desc: "Understand high-interest mobile money loans (Qwikloan, Fido) and how to manage debt effectively.",
    duration: "15 min",
    xp: "150 XP",
    xpVal: 150,
    emoji: "💸",
    content: [
      "Quick loans on mobile networks seem convenient, but their interest rates can lead to cycle debt traps.",
      "1. Calculate annual interest rates. A flat interest rate of 6.9% for a 30-day loan equates to over 82% annual interest (APR). This is much higher than standard bank rates.",
      "2. Avoid using loans for consumer spending. Only borrow money for emergencies or business ventures that produce cash flow.",
      "3. Create a strict payoff timeline. Pay back digital loans early to prevent late payment penalties and preserve your credit history with local credit reference bureaus.",
    ],
  },
  {
    id: 3,
    title: "Treasury Bills & Mutual Funds",
    desc: "An introduction to Ghana Treasury Bills, local Money Market Mutual Funds, and local stocks.",
    duration: "20 min",
    xp: "200 XP",
    xpVal: 200,
    emoji: "📈",
    content: [
      "Building wealth requires putting your money to work in assets that outpace inflation.",
      "1. Ghana Government Treasury Bills are low-risk debt instruments. You buy them at a discount (e.g. paying GH₵ 800 for a GH₵ 1000 face value bill) and receive full principal at maturity (91, 182, or 364 days).",
      "2. Money Market Mutual Funds pool capital from thousands of savers to invest in a basket of secure treasury assets, offering higher yields than traditional bank savings with high liquidity.",
      "3. Compounding Interest is the key: reinvesting your yield at maturity allows your savings to grow exponentially over time.",
    ],
  },
  {
    id: 4,
    title: "Pensions & Provident Funds",
    desc: "Understanding SSNIT (Tiers 1 & 2), voluntary provident funds (Tier 3), and private retirement schemes.",
    duration: "18 min",
    xp: "180 XP",
    xpVal: 180,
    emoji: "🛡️",
    content: [
      "Retirement planning ensures security when your active earning years end.",
      "1. Tier 1 (SSNIT): A mandatory, public pension scheme. A portion of your gross monthly salary is paid here to guarantee a monthly pension payouts in old age.",
      "2. Tier 2: A mandatory private occupational scheme. This is managed by private trustees and paid out as a lump-sum payment upon retirement.",
      "3. Tier 3: Voluntary personal pension plans. These offer tax benefits and let you save extra funds that you can access earlier in case of emergency.",
    ],
  },
  {
    id: 5,
    title: "Student Loans & Bursaries",
    desc: "Learn about the Student Loan Trust Fund (SLTF), KNUST/GETFund bursaries, and managing student debt.",
    duration: "12 min",
    xp: "120 XP",
    xpVal: 120,
    emoji: "🎓",
    content: [
      "Higher education in Ghana is a major investment. Knowing how to finance it without overwhelming debt is crucial.",
      "1. Student Loan Trust Fund (SLTF) offers loans to tertiary students. It requires a Ghana Card and can be guarantor-free under recent reforms. Use these funds strictly for academic fees, accommodation, and essential books.",
      "2. KNUST, GETFund, and corporate bursaries are non-repayable grants. Check with your university's Dean of Student Affairs or financial aid office early in the academic year to apply.",
      "3. Avoid commercial bank loans for schooling if possible, as their high commercial interest rates can create massive burden compared to specialized student loan schemes.",
    ],
  },
  {
    id: 6,
    title: "Side Hustles & Business Finance",
    desc: "Explore business ideation, managing startup costs, and separating personal from business finances on campus.",
    duration: "15 min",
    xp: "150 XP",
    xpVal: 150,
    emoji: "💼",
    content: [
      "Starting a micro-business on campus is a great way to build real-world financial skills and earn extra income.",
      "1. Start small and test. Do not dump all your savings into inventory. Validate your business idea with fellow students first (e.g., printing services, baking, digital design, tutoring).",
      "2. Separate personal and business funds. Set up a separate mobile money wallet or bank account for your side hustle. Never mix daily food money with business capital.",
      "3. Calculate net profit margins. Reinvest a portion of your profits back into growing the business rather than spending all the initial revenue on personal items.",
    ],
  },
];

export const RECOMMENDED_LESSONS: Record<string, { tag: string; title: string; desc: string }> = {
  "Build an Emergency Fund": {
    tag: "Emergency Fund",
    title: "MoMo Savings & Vaults",
    desc: "Learn to separate savings from spending money using MTN MoMo Vault or Telecel Cash.",
  },
  "Improve Budgeting": {
    tag: "Budgeting Basics",
    title: "Managing MoMo Fees & E-levy",
    desc: "Identify transaction costs and E-levy fees that leak money, and learn to minimize them.",
  },
  "Learn Investing": {
    tag: "Investing Pro",
    title: "Ghana Treasury Bills 101",
    desc: "An entry-level guide to buying 91-day and 182-day government Treasury Bills.",
  },
  "Become Debt Free": {
    tag: "Debt Payoff",
    title: "Avoiding Digital Loan Traps",
    desc: "Learn why high-interest mobile apps (Qwikloan, Fido) can be dangerous and how to avoid debt traps.",
  },
  "Start a Business": {
    tag: "Business Finance",
    title: "Student Side-Hustles 101",
    desc: "Explore business ideation, managing startup costs, and cash flow on a student budget.",
  },
  "Save for Education": {
    tag: "Education Saving",
    title: "Student Loans & Bursaries in Ghana",
    desc: "Learn how the Student Loan Trust Fund (SLTF) works, alongside local KNUST and GETFund bursaries.",
  },
};

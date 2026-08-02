export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

export const MODULE_QUIZZES: Record<number, QuizQuestion[]> = {
  1: [
    {
      question: "How does the E-levy tax apply to Mobile Money (MoMo) transactions in Ghana?",
      options: [
        { text: "It charges 1% on all transactions starting from the first Cedi", isCorrect: false },
        { text: "It charges 1% on daily cumulative transfers exceeding GH₵ 100", isCorrect: true },
        { text: "It charges a flat fee of GH₵ 5 on withdrawals only", isCorrect: false },
      ],
    },
    {
      question: "Which of the following is a recommended strategy to reduce MoMo transaction costs?",
      options: [
        { text: "Splitting a single large transaction into multiple transfers of GH₵ 150 each", isCorrect: false },
        { text: "Reaching the daily limit and ignoring E-levy", isCorrect: false },
        { text: "Bundling transfers or keeping individual transfers below GH₵ 100 where possible", isCorrect: true },
      ],
    },
    {
      question: "What is the primary function of features like MTN MoMo Vault or Telecel Cash Vault?",
      options: [
        { text: "To lock savings away from everyday pocket money to restrict easy spending", isCorrect: true },
        { text: "To borrow money with zero interest", isCorrect: false },
        { text: "To make fast online payments with zero security check", isCorrect: false },
      ],
    },
    {
      question: "Why should you keep a log of small cash-out fees?",
      options: [
        { text: "Because the government requires it for personal income tax filing", isCorrect: false },
        { text: "To track how small, recurring GHS 5 withdrawal charges compound into large sums over a year", isCorrect: true },
        { text: "To get refunded by your mobile network operator", isCorrect: false },
      ],
    },
    {
      question: "If you transfer GH₵ 150 today, how does the E-levy apply?",
      options: [
        { text: "No E-levy because it is under GH₵ 200", isCorrect: false },
        { text: "You are charged 1% on the portion exceeding GH₵ 100 (which is GH₵ 50)", isCorrect: true },
        { text: "You are charged 10% on the total amount", isCorrect: false },
      ],
    }
  ],
  2: [
    {
      question: "If a digital quick loan charges a flat 6.9% interest rate for 30 days, what is the approximate annual interest rate (APR)?",
      options: [
        { text: "Over 82%", isCorrect: true },
        { text: "Exactly 6.9%", isCorrect: false },
        { text: "Under 15%", isCorrect: false },
      ],
    },
    {
      question: "Why are short-term digital loans (like Qwikloan or Fido) often considered risky?",
      options: [
        { text: "They don't allow you to repay early", isCorrect: false },
        { text: "Their high short-term interest rates can lead to a cycle of debt traps if misused", isCorrect: true },
        { text: "They report you to the police immediately on the first day of delay", isCorrect: false },
      ],
    },
    {
      question: "Which of the following is a smart reason to borrow money?",
      options: [
        { text: "To buy the latest smartphone to impress friends", isCorrect: false },
        { text: "For emergencies or to invest in a business venture that produces positive cash flow", isCorrect: true },
        { text: "To pay off a low-interest bank loan using a high-interest mobile money loan", isCorrect: false },
      ],
    },
    {
      question: "What happens if you fail to repay a digital mobile money loan in Ghana?",
      options: [
        { text: "Your credit history is negatively reported to credit reference bureaus, affecting future loan access", isCorrect: true },
        { text: "Your phone is permanently disabled from making calls", isCorrect: false },
        { text: "The network provider clears your bank savings accounts automatically", isCorrect: false },
      ],
    },
    {
      question: "What does APR stand for in finance?",
      options: [
        { text: "Annual Percentage Rate, representing the yearly cost of borrowing", isCorrect: true },
        { text: "Active Payment Ratio, representing the speed of loan payments", isCorrect: false },
        { text: "Asset Pricing Rule, representing the cost of stocks", isCorrect: false },
      ],
    }
  ],
  3: [
    {
      question: "How do Ghana Government Treasury Bills (T-bills) pay interest to investors?",
      options: [
        { text: "They pay monthly dividends directly to your mobile wallet", isCorrect: false },
        { text: "They are sold at a discount and pay full face value upon maturity", isCorrect: true },
        { text: "They yield variable profits depending on stock market index prices", isCorrect: false },
      ],
    },
    {
      question: "Which maturity terms are standard for Ghana Government Treasury Bills?",
      options: [
        { text: "30 days, 60 days, and 90 days", isCorrect: false },
        { text: "91 days, 182 days, and 364 days", isCorrect: true },
        { text: "5 years, 10 years, and 20 years", isCorrect: false },
      ],
    },
    {
      question: "What is a Money Market Mutual Fund?",
      options: [
        { text: "A high-risk fund that trades cryptocurrency and global stocks", isCorrect: false },
        { text: "A fund that pools capital to invest in a basket of secure treasury assets, offering high liquidity", isCorrect: true },
        { text: "A loan program designed for market women", isCorrect: false },
      ],
    },
    {
      question: "What is Compounding Interest?",
      options: [
        { text: "Paying double fees on late loan payments", isCorrect: false },
        { text: "Reinvesting your earned yields so that you earn interest on top of your interest", isCorrect: true },
        { text: "The standard tax charged by the government on investment products", isCorrect: false },
      ],
    },
    {
      question: "Why are Treasury Bills considered low-risk investments in Ghana?",
      options: [
        { text: "They are backed by the full faith and credit of the Government of Ghana", isCorrect: true },
        { text: "They guarantee a 100% monthly return on investment", isCorrect: false },
        { text: "They are insured by international commercial banks", isCorrect: false },
      ],
    }
  ],
  4: [
    {
      question: "Which tier of the Ghana Pension (SSNIT) scheme is voluntary and offers extra tax benefits?",
      options: [
        { text: "Tier 1 (Mandatory Public Pension)", isCorrect: false },
        { text: "Tier 2 (Mandatory Occupational Scheme)", isCorrect: false },
        { text: "Tier 3 (Voluntary Personal/Provident Pension)", isCorrect: true },
      ],
    },
    {
      question: "How is Tier 2 of the SSNIT pension scheme managed and paid out?",
      options: [
        { text: "Managed by public trustees and paid as monthly pension payments", isCorrect: false },
        { text: "Managed by private trustees and paid out as a lump-sum payment upon retirement", isCorrect: true },
        { text: "Managed by the employer and deducted as cash advance", isCorrect: false },
      ],
    },
    {
      question: "What is the primary benefit of contributing to a voluntary Tier 3 Provident Fund?",
      options: [
        { text: "It allows tax-free contributions that grow compound interest and can serve as an emergency cushion", isCorrect: true },
        { text: "It pays you a salary while you are still studying", isCorrect: false },
        { text: "It guarantees a free mortgage on a house", isCorrect: false },
      ],
    },
    {
      question: "Who is eligible to register and contribute to SSNIT in Ghana?",
      options: [
        { text: "Only government workers", isCorrect: false },
        { text: "Both formal sector employees and self-employed/informal workers", isCorrect: true },
        { text: "Only people above the age of 60", isCorrect: false },
      ],
    },
    {
      question: "What is the purpose of Tier 1 under the SSNIT structure?",
      options: [
        { text: "To pay out monthly pensions to retirees to replace their active working income", isCorrect: true },
        { text: "To provide short-term cash loans for building houses", isCorrect: false },
        { text: "To pay for national healthcare services", isCorrect: false },
      ],
    }
  ],
  5: [
    {
      question: "What is the main requirement to access the Student Loan Trust Fund (SLTF) in Ghana?",
      options: [
        { text: "A collateral of landed property or a house", isCorrect: false },
        { text: "A valid Ghana Card (and it can be guarantor-free under recent policies)", isCorrect: true },
        { text: "A bank balance of at least GH₵ 10,000", isCorrect: false },
      ],
    },
    {
      question: "How should student loans be managed to avoid long-term financial burden?",
      options: [
        { text: "Spent on buying high-end gadgets and hosting parties", isCorrect: false },
        { text: "Used strictly for academic fees, accommodation, and essential learning materials", isCorrect: true },
        { text: "Lent to friends to earn interest on campus", isCorrect: false },
      ],
    },
    {
      question: "What are KNUST, GETFund, or corporate bursaries?",
      options: [
        { text: "High-interest commercial loans", isCorrect: false },
        { text: "Non-repayable grants/scholarships awarded to students based on merit or financial need", isCorrect: true },
        { text: "Mandatory taxes deducted from students' pockets", isCorrect: false },
      ],
    },
    {
      question: "Where should a student go to inquire about financial aid and bursaries on campus?",
      options: [
        { text: "The nearest commercial bank branch", isCorrect: false },
        { text: "The Dean of Student Affairs or Financial Aid Office", isCorrect: true },
        { text: "The Student Representative Council (SRC) entertainment committee", isCorrect: false },
      ],
    },
    {
      question: "Why should you avoid high-interest commercial bank loans for financing your education?",
      options: [
        { text: "Because commercial banks do not give loans to students", isCorrect: false },
        { text: "Their high interest rates and short payback terms create heavy financial stress compared to specialized student schemes", isCorrect: true },
        { text: "Because commercial loans must be repaid in dollars", isCorrect: false },
      ],
    }
  ],
  6: [
    {
      question: "When starting a student side hustle, what is the best strategy regarding capital?",
      options: [
        { text: "Borrowing massive loans to rent a luxury office space", isCorrect: false },
        { text: "Starting small, validating the idea with classmates, and avoiding dumping all savings into unverified inventory", isCorrect: true },
        { text: "Buying expensive stock without checking student demand", isCorrect: false },
      ],
    },
    {
      question: "Why is it crucial to separate personal and business funds?",
      options: [
        { text: "To avoid mixing your daily food/pocket money with business capital, which ruins business tracking", isCorrect: true },
        { text: "To pay less tax to the government", isCorrect: false },
        { text: "Because it is illegal to keep them together in the same wallet", isCorrect: false },
      ],
    },
    {
      question: "What is a 'net profit margin'?",
      options: [
        { text: "The total amount of money collected from sales", isCorrect: false },
        { text: "The actual profit left over after subtracting all business expenses from total revenue", isCorrect: true },
        { text: "The total amount of loans a business has taken", isCorrect: false },
      ],
    },
    {
      question: "Which of the following is a viable low-capital side hustle for a student?",
      options: [
        { text: "Opening a commercial airline agency", isCorrect: false },
        { text: "Digital design, academic tutoring, printing services, or customized baking", isCorrect: true },
        { text: "Setting up a petrol filling station", isCorrect: false },
      ],
    },
    {
      question: "What should you do with your business profits in the early stages?",
      options: [
        { text: "Spend them all on personal lifestyle improvements", isCorrect: false },
        { text: "Reinvest a portion back into the business to buy better tools or inventory for growth", isCorrect: true },
        { text: "Hide them under your mattress to avoid mobile money fees", isCorrect: false },
      ],
    }
  ],
  7: [
    {
      question: "What primarily determines your digital credit score with lenders like Fido or MTN Credit in Ghana?",
      options: [
        { text: "Your university degree and job title", isCorrect: false },
        { text: "Your mobile money activity, airtime top-ups, and repayment history", isCorrect: true },
        { text: "The amount of cash you keep at home", isCorrect: false },
      ],
    },
    {
      question: "What happens if you repay a Qwikloan or Fido loan late?",
      options: [
        { text: "Nothing, as long as you repay within a year", isCorrect: false },
        { text: "It can lower your digital credit score and reduce your future borrowing limit", isCorrect: true },
        { text: "Your MoMo wallet gets permanently frozen", isCorrect: false },
      ],
    },
    {
      question: "Under the Ghana Credit Reporting Act, how often can you request a free credit report?",
      options: [
        { text: "Once per year", isCorrect: true },
        { text: "Once per month", isCorrect: false },
        { text: "Never — it's always a paid service", isCorrect: false },
      ],
    },
    {
      question: "Which of these organizations acts as a credit bureau in Ghana?",
      options: [
        { text: "TransUnion Ghana", isCorrect: true },
        { text: "Bank of Ghana Treasury Department", isCorrect: false },
        { text: "Ghana Revenue Authority", isCorrect: false },
      ],
    },
    {
      question: "Why should you avoid applying for multiple digital loans at the same time?",
      options: [
        { text: "Each application can negatively signal risk and lower your score", isCorrect: true },
        { text: "It is illegal in Ghana", isCorrect: false },
        { text: "A MoMo wallet can only hold one loan type at a time", isCorrect: false },
      ],
    },
  ]
};

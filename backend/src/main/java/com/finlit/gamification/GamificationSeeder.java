package com.finlit.gamification;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Seeds the full quiz bank (all 6 modules). Each module is guarded independently
 * by a count check, so re-running never duplicates. (The leaderboard shows real
 * users only — no seeded competitors.)
 */
@Component
@Order(2)
public class GamificationSeeder implements CommandLineRunner {

    private final QuizQuestionRepository quizQuestionRepository;

    public GamificationSeeder(QuizQuestionRepository quizQuestionRepository) {
        this.quizQuestionRepository = quizQuestionRepository;
    }

    @Override
    public void run(String... args) {
        seedQuizzes();
    }

    private void seedQuizzes() {
        seedModule(1L, List.of(
                q("How does the E-levy tax apply to Mobile Money (MoMo) transactions in Ghana?",
                        opt("It charges 1% on all transactions starting from the first Cedi", false),
                        opt("It charges 1% on daily cumulative transfers exceeding GH₵ 100", true),
                        opt("It charges a flat fee of GH₵ 5 on withdrawals only", false)),
                q("Which of the following is a recommended strategy to reduce MoMo transaction costs?",
                        opt("Splitting a single large transaction into multiple transfers of GH₵ 150 each", false),
                        opt("Reaching the daily limit and ignoring E-levy", false),
                        opt("Bundling transfers or keeping individual transfers below GH₵ 100 where possible", true)),
                q("What is the primary function of features like MTN MoMo Vault or Telecel Cash Vault?",
                        opt("To lock savings away from everyday pocket money to restrict easy spending", true),
                        opt("To borrow money with zero interest", false),
                        opt("To make fast online payments with zero security check", false)),
                q("Why should you keep a log of small cash-out fees?",
                        opt("Because the government requires it for personal income tax filing", false),
                        opt("To track how small, recurring GHS 5 withdrawal charges compound into large sums over a year", true),
                        opt("To get refunded by your mobile network operator", false)),
                q("If you transfer GH₵ 150 today, how does the E-levy apply?",
                        opt("No E-levy because it is under GH₵ 200", false),
                        opt("You are charged 1% on the portion exceeding GH₵ 100 (which is GH₵ 50)", true),
                        opt("You are charged 10% on the total amount", false))
        ));

        seedModule(2L, List.of(
                q("If a digital quick loan charges a flat 6.9% interest rate for 30 days, what is the approximate annual interest rate (APR)?",
                        opt("Over 82%", true),
                        opt("Exactly 6.9%", false),
                        opt("Under 15%", false)),
                q("Why are short-term digital loans (like Qwikloan or Fido) often considered risky?",
                        opt("They don't allow you to repay early", false),
                        opt("Their high short-term interest rates can lead to a cycle of debt traps if misused", true),
                        opt("They report you to the police immediately on the first day of delay", false)),
                q("Which of the following is a smart reason to borrow money?",
                        opt("To buy the latest smartphone to impress friends", false),
                        opt("For emergencies or to invest in a business venture that produces positive cash flow", true),
                        opt("To pay off a low-interest bank loan using a high-interest mobile money loan", false)),
                q("What happens if you fail to repay a digital mobile money loan in Ghana?",
                        opt("Your credit history is negatively reported to credit reference bureaus, affecting future loan access", true),
                        opt("Your phone is permanently disabled from making calls", false),
                        opt("The network provider clears your bank savings accounts automatically", false)),
                q("What does APR stand for in finance?",
                        opt("Annual Percentage Rate, representing the yearly cost of borrowing", true),
                        opt("Active Payment Ratio, representing the speed of loan payments", false),
                        opt("Asset Pricing Rule, representing the cost of stocks", false))
        ));

        seedModule(3L, List.of(
                q("How do Ghana Government Treasury Bills (T-bills) pay interest to investors?",
                        opt("They pay monthly dividends directly to your mobile wallet", false),
                        opt("They are sold at a discount and pay full face value upon maturity", true),
                        opt("They yield variable profits depending on stock market index prices", false)),
                q("Which maturity terms are standard for Ghana Government Treasury Bills?",
                        opt("30 days, 60 days, and 90 days", false),
                        opt("91 days, 182 days, and 364 days", true),
                        opt("5 years, 10 years, and 20 years", false)),
                q("What is a Money Market Mutual Fund?",
                        opt("A high-risk fund that trades cryptocurrency and global stocks", false),
                        opt("A fund that pools capital to invest in a basket of secure treasury assets, offering high liquidity", true),
                        opt("A loan program designed for market women", false)),
                q("What is Compounding Interest?",
                        opt("Paying double fees on late loan payments", false),
                        opt("Reinvesting your earned yields so that you earn interest on top of your interest", true),
                        opt("The standard tax charged by the government on investment products", false)),
                q("Why are Treasury Bills considered low-risk investments in Ghana?",
                        opt("They are backed by the full faith and credit of the Government of Ghana", true),
                        opt("They guarantee a 100% monthly return on investment", false),
                        opt("They are insured by international commercial banks", false))
        ));

        seedModule(4L, List.of(
                q("Which tier of the Ghana Pension (SSNIT) scheme is voluntary and offers extra tax benefits?",
                        opt("Tier 1 (Mandatory Public Pension)", false),
                        opt("Tier 2 (Mandatory Occupational Scheme)", false),
                        opt("Tier 3 (Voluntary Personal/Provident Pension)", true)),
                q("How is Tier 2 of the SSNIT pension scheme managed and paid out?",
                        opt("Managed by public trustees and paid as monthly pension payments", false),
                        opt("Managed by private trustees and paid out as a lump-sum payment upon retirement", true),
                        opt("Managed by the employer and deducted as cash advance", false)),
                q("What is the primary benefit of contributing to a voluntary Tier 3 Provident Fund?",
                        opt("It allows tax-free contributions that grow compound interest and can serve as an emergency cushion", true),
                        opt("It pays you a salary while you are still studying", false),
                        opt("It guarantees a free mortgage on a house", false)),
                q("Who is eligible to register and contribute to SSNIT in Ghana?",
                        opt("Only government workers", false),
                        opt("Both formal sector employees and self-employed/informal workers", true),
                        opt("Only people above the age of 60", false)),
                q("What is the purpose of Tier 1 under the SSNIT structure?",
                        opt("To pay out monthly pensions to retirees to replace their active working income", true),
                        opt("To provide short-term cash loans for building houses", false),
                        opt("To pay for national healthcare services", false))
        ));

        seedModule(5L, List.of(
                q("What is the main requirement to access the Student Loan Trust Fund (SLTF) in Ghana?",
                        opt("A collateral of landed property or a house", false),
                        opt("A valid Ghana Card (and it can be guarantor-free under recent policies)", true),
                        opt("A bank balance of at least GH₵ 10,000", false)),
                q("How should student loans be managed to avoid long-term financial burden?",
                        opt("Spent on buying high-end gadgets and hosting parties", false),
                        opt("Used strictly for academic fees, accommodation, and essential learning materials", true),
                        opt("Lent to friends to earn interest on campus", false)),
                q("What are KNUST, GETFund, or corporate bursaries?",
                        opt("High-interest commercial loans", false),
                        opt("Non-repayable grants/scholarships awarded to students based on merit or financial need", true),
                        opt("Mandatory taxes deducted from students' pockets", false)),
                q("Where should a student go to inquire about financial aid and bursaries on campus?",
                        opt("The nearest commercial bank branch", false),
                        opt("The Dean of Student Affairs or Financial Aid Office", true),
                        opt("The Student Representative Council (SRC) entertainment committee", false)),
                q("Why should you avoid high-interest commercial bank loans for financing your education?",
                        opt("Because commercial banks do not give loans to students", false),
                        opt("Their high interest rates and short payback terms create heavy financial stress compared to specialized student schemes", true),
                        opt("Because commercial loans must be repaid in dollars", false))
        ));

        seedModule(6L, List.of(
                q("When starting a student side hustle, what is the best strategy regarding capital?",
                        opt("Borrowing massive loans to rent a luxury office space", false),
                        opt("Starting small, validating the idea with classmates, and avoiding dumping all savings into unverified inventory", true),
                        opt("Buying expensive stock without checking student demand", false)),
                q("Why is it crucial to separate personal and business funds?",
                        opt("To avoid mixing your daily food/pocket money with business capital, which ruins business tracking", true),
                        opt("To pay less tax to the government", false),
                        opt("Because it is illegal to keep them together in the same wallet", false)),
                q("What is a 'net profit margin'?",
                        opt("The total amount of money collected from sales", false),
                        opt("The actual profit left over after subtracting all business expenses from total revenue", true),
                        opt("The total amount of loans a business has taken", false)),
                q("Which of the following is a viable low-capital side hustle for a student?",
                        opt("Opening a commercial airline agency", false),
                        opt("Digital design, academic tutoring, printing services, or customized baking", true),
                        opt("Setting up a petrol filling station", false)),
                q("What should you do with your business profits in the early stages?",
                        opt("Spend them all on personal lifestyle improvements", false),
                        opt("Reinvest a portion back into the business to buy better tools or inventory for growth", true),
                        opt("Hide them under your mattress to avoid mobile money fees", false))
        ));
    }

    // ── builder helpers ─────────────────────────────────────────────────────

    /** A question template before it's turned into an entity with a module + order. */
    private record Q(String text, List<QuizOption> options) {}

    private void seedModule(Long moduleId, List<Q> questions) {
        if (quizQuestionRepository.countByModuleId(moduleId) > 0) {
            return;
        }
        List<QuizQuestion> entities = new ArrayList<>();
        for (int i = 0; i < questions.size(); i++) {
            Q template = questions.get(i);
            QuizQuestion entity = new QuizQuestion();
            entity.setModuleId(moduleId);
            entity.setQuestionOrder(i);
            entity.setQuestion(template.text());
            entity.setOptions(new ArrayList<>(template.options()));
            entities.add(entity);
        }
        quizQuestionRepository.saveAll(entities);
    }

    private Q q(String text, QuizOption... options) {
        return new Q(text, List.of(options));
    }

    private QuizOption opt(String text, boolean correct) {
        return new QuizOption(text, correct);
    }
}

package com.finlit.content;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Loads the real FinLit lesson catalog and news articles into the database on
 * startup — but only if the tables are empty, so it never duplicates or
 * overwrites data on subsequent runs. Ported from the frontend's data files.
 */
@Component
@Order(1)
public class ContentSeeder implements CommandLineRunner {

    private final LessonRepository lessonRepository;
    private final NewsRepository newsRepository;

    public ContentSeeder(LessonRepository lessonRepository, NewsRepository newsRepository) {
        this.lessonRepository = lessonRepository;
        this.newsRepository = newsRepository;
    }

    @Override
    public void run(String... args) {
        if (lessonRepository.count() == 0) {
            seedLessons();
        }
        // Idempotent per-article, so new articles are added on restart.
        seedNews();
    }

    private void seedLessons() {
        lessonRepository.saveAll(List.of(
                lesson(1L, "MoMo Budgeting & Saving",
                        "Learn to track daily expenses, plan for E-levy/MoMo transaction fees, and save in mobile wallets.",
                        "10 min", 100, "📱", List.of(
                                "Mobile Money (MoMo) is the primary engine of personal finance in West Africa. Understanding how to manage fees is the first step toward building savings.",
                                "1. Separate your pocket money from your savings. Use separate vault wallets like MTN MoMo Vault or Telecel Cash to restrict easy access to your money.",
                                "2. Calculate transaction fees before sending. E-levy adds a 1% charge on daily transfers exceeding GH₵ 100. By keeping transfers below this limit or bundling them strategically, you can save significant transaction costs.",
                                "3. Track your daily expenses. Keep a small log of cash-out fees. Even small GHS 5 withdrawal charges compound into hundreds of Ghana Cedis over the course of a year.")),

                lesson(2L, "Avoiding Digital Debt Traps",
                        "Understand high-interest mobile money loans (Qwikloan, Fido) and how to manage debt effectively.",
                        "15 min", 150, "💸", List.of(
                                "Quick loans on mobile networks seem convenient, but their interest rates can lead to cycle debt traps.",
                                "1. Calculate annual interest rates. A flat interest rate of 6.9% for a 30-day loan equates to over 82% annual interest (APR). This is much higher than standard bank rates.",
                                "2. Avoid using loans for consumer spending. Only borrow money for emergencies or business ventures that produce cash flow.",
                                "3. Create a strict payoff timeline. Pay back digital loans early to prevent late payment penalties and preserve your credit history with local credit reference bureaus.")),

                lesson(3L, "Treasury Bills & Mutual Funds",
                        "An introduction to Ghana Treasury Bills, local Money Market Mutual Funds, and local stocks.",
                        "20 min", 200, "📈", List.of(
                                "Building wealth requires putting your money to work in assets that outpace inflation.",
                                "1. Ghana Government Treasury Bills are low-risk debt instruments. You buy them at a discount (e.g. paying GH₵ 800 for a GH₵ 1000 face value bill) and receive full principal at maturity (91, 182, or 364 days).",
                                "2. Money Market Mutual Funds pool capital from thousands of savers to invest in a basket of secure treasury assets, offering higher yields than traditional bank savings with high liquidity.",
                                "3. Compounding Interest is the key: reinvesting your yield at maturity allows your savings to grow exponentially over time.")),

                lesson(4L, "Pensions & Provident Funds",
                        "Understanding SSNIT (Tiers 1 & 2), voluntary provident funds (Tier 3), and private retirement schemes.",
                        "18 min", 180, "🛡️", List.of(
                                "Retirement planning ensures security when your active earning years end.",
                                "1. Tier 1 (SSNIT): A mandatory, public pension scheme. A portion of your gross monthly salary is paid here to guarantee a monthly pension payouts in old age.",
                                "2. Tier 2: A mandatory private occupational scheme. This is managed by private trustees and paid out as a lump-sum payment upon retirement.",
                                "3. Tier 3: Voluntary personal pension plans. These offer tax benefits and let you save extra funds that you can access earlier in case of emergency.")),

                lesson(5L, "Student Loans & Bursaries",
                        "Learn about the Student Loan Trust Fund (SLTF), KNUST/GETFund bursaries, and managing student debt.",
                        "12 min", 120, "🎓", List.of(
                                "Higher education in Ghana is a major investment. Knowing how to finance it without overwhelming debt is crucial.",
                                "1. Student Loan Trust Fund (SLTF) offers loans to tertiary students. It requires a Ghana Card and can be guarantor-free under recent reforms. Use these funds strictly for academic fees, accommodation, and essential books.",
                                "2. KNUST, GETFund, and corporate bursaries are non-repayable grants. Check with your university's Dean of Student Affairs or financial aid office early in the academic year to apply.",
                                "3. Avoid commercial bank loans for schooling if possible, as their high commercial interest rates can create massive burden compared to specialized student loan schemes.")),

                lesson(6L, "Side Hustles & Business Finance",
                        "Explore business ideation, managing startup costs, and separating personal from business finances on campus.",
                        "15 min", 150, "💼", List.of(
                                "Starting a micro-business on campus is a great way to build real-world financial skills and earn extra income.",
                                "1. Start small and test. Do not dump all your savings into inventory. Validate your business idea with fellow students first (e.g., printing services, baking, digital design, tutoring).",
                                "2. Separate personal and business funds. Set up a separate mobile money wallet or bank account for your side hustle. Never mix daily food money with business capital.",
                                "3. Calculate net profit margins. Reinvest a portion of your profits back into growing the business rather than spending all the initial revenue on personal items."))
        ));
    }

    private void seedNews() {
        Instant now = Instant.now();
        List<NewsArticle> articles = List.of(
                news(1L, "Bank of Ghana Adjusts Monetary Policy Rate to Curb Inflation",
                        "Bank of Ghana", "https://www.bog.gov.gh/monetary-policy/", "Policy",
                        now.minus(2, ChronoUnit.HOURS), "4 min read",
                        "https://picsum.photos/seed/bog-monetary-policy/800/450",
                        "The MPC has revised the policy rate to manage local inflation, influencing interest yields on bank deposits and commercial loans across Ghana.",
                        List.of(
                                "The Monetary Policy Committee (MPC) of the Bank of Ghana has adjusted the benchmark monetary policy rate to help curb macroeconomic inflationary pressures.",
                                "When the central bank raises interest rates, commercial banks typically increase their interest yields on fixed deposit accounts, mutual funds, and savings products. If you have cash stored in money market funds, you are likely to see an increase in monthly yields.",
                                "However, there is a flip side. The cost of borrowing money also increases. If you have outstanding credit or are planning to apply for local commercial loans or digital credit (like Qwikloan or Fido), the borrowing fees and interest charges may rise in response to central bank rate adjustments.",
                                "Financial experts advise maintaining high liquidity in high-yield money market accounts during rate hikes to maximize risk-free earnings while avoiding high-interest debt.")),

                news(2L, "How E-Levy and MoMo Fees Impact Student Allowances & Small Businesses",
                        "Joy Business", "https://www.myjoyonline.com/business/", "Fintech",
                        now.minus(5, ChronoUnit.HOURS), "5 min read",
                        "https://picsum.photos/seed/momo-elevy-ghana/800/450",
                        "An analysis of how mobile money transaction charges and E-levy affect daily cash flow, and three strategies to save on transfer costs.",
                        List.of(
                                "Mobile money is the heartbeat of transactions in Ghana, but E-levy and carrier fees can add up to a significant monthly expense if left unmonitored.",
                                "The current Electronic Transfer Levy (E-levy) sits at 1% on electronic transfers. Crucially, the first GH₵ 100 sent per day is exempt from this tax. Understanding this exemption is vital for students and micro-merchants who send money frequently.",
                                "To optimize transaction costs:\n\n1. Split transfers: Send GH₵ 100 today and GH₵ 100 tomorrow to avoid E-levy completely.\n\n2. Bank-to-Wallet pathways: Transferring from your bank app to your own MoMo wallet is exempt from E-levy.\n\n3. Cash Out Wisely: Carrier cash-out fees are capped at roughly GH₵ 10 for withdrawals above GH₵ 1,000. One large withdrawal is almost always cheaper than several small ones.")),

                news(3L, "Ghana Treasury Bills Explained: Why T-Bills Remain a Popular Safe Haven",
                        "Ghana Stock Exchange", "https://www.gse.com.gh/", "Investing",
                        now.minus(1, ChronoUnit.DAYS), "6 min read",
                        "https://picsum.photos/seed/tbills-gse-invest/800/450",
                        "A beginner's guide to 91-day and 182-day Treasury Bills, current interest yields, and how to purchase them via mobile money in Ghana.",
                        List.of(
                                "In times of market volatility, individual investors look for a safe place to store capital. In Ghana, Treasury Bills (T-Bills) remain the most popular risk-free investment asset.",
                                "Treasury Bills are short-term government debt instruments. When you buy a T-Bill, you are lending money directly to the Government of Ghana. The government promises to pay you back at maturity with interest. Because they are backed by the state, they carry near-zero default risk.",
                                "T-Bills are sold at a discount. For example, if you buy a GH₵ 1,000 bill, you might pay GH₵ 800 upfront. At the end of the tenure (e.g. 91 days), the government pays you the full GH₵ 1,000. The interest yields have historically been high, hovering between 24% and 28% annually.",
                                "You don't need millions to start. Most local retail banks and investment firms allow you to purchase T-bills with as little as GH₵ 50, and you can manage your roll-over options using mobile money USSD codes directly from your phone.")),

                news(4L, "MTN Qwikloan vs Bank Personal Loan: Which Costs More in 2026?",
                        "Citi Business News", "https://citibusinessnews.com/", "Fintech",
                        now.minus(1, ChronoUnit.DAYS), "5 min read",
                        "https://picsum.photos/seed/qwikloan-bank-compare/800/450",
                        "A side-by-side comparison of interest rates, repayment terms, and hidden fees between MTN Qwikloan and standard bank personal loans in Ghana.",
                        List.of(
                                "With the rise of digital lending platforms, many Ghanaians now have instant access to credit via their mobile phones. But convenience often comes at a premium.",
                                "MTN Qwikloan charges a flat monthly interest rate of approximately 6.9%, which translates to an Annual Percentage Rate (APR) exceeding 82%. While the loan disburses within minutes, the effective cost of borrowing is significantly higher than traditional bank products.",
                                "By contrast, a standard bank personal loan in Ghana carries monthly interest rates between 2% and 3.5%, depending on your credit profile and relationship with the bank. While the application process takes longer (3–7 business days), the total interest paid over the loan period is substantially lower.",
                                "The key takeaway: use mobile quick-loans only for genuine emergencies with a clear repayment plan. For planned expenses, a bank loan or cooperative credit union will always be cheaper in the long run.")),

                news(5L, "SSNIT Pension Updates: What the New Contribution Rates Mean for You",
                        "Ghana Business News", "https://www.ghanabusinessnews.com/", "Policy",
                        now.minus(2, ChronoUnit.DAYS), "4 min read",
                        "https://picsum.photos/seed/ssnit-pension-ghana/800/450",
                        "Breaking down the latest SSNIT contribution rate changes and how they affect your monthly salary deductions and future retirement payout.",
                        List.of(
                                "The Social Security and National Insurance Trust (SSNIT) periodically adjusts contribution rates to ensure the sustainability of the national pension scheme.",
                                "Currently, employees contribute 5.5% of their gross monthly salary to SSNIT, while employers contribute an additional 13%. These contributions fund your Tier 1 pension, which provides a monthly payment upon retirement.",
                                "Recent reforms have expanded Tier 3 voluntary pension schemes, allowing workers to make additional tax-advantaged contributions through private pension fund managers. This is particularly beneficial for self-employed individuals and side-hustle earners.",
                                "Experts recommend starting voluntary Tier 3 contributions as early as possible — even small monthly amounts can compound significantly over a 30-year career.")),

                news(6L, "How to Start Investing in the Ghana Stock Exchange with Just GH₵ 100",
                        "Ghana Stock Exchange", "https://www.gse.com.gh/", "Investing",
                        now.minus(3, ChronoUnit.DAYS), "6 min read",
                        "https://picsum.photos/seed/gse-stock-market/800/450",
                        "A step-by-step guide to opening a brokerage account and buying your first shares on the GSE, even on a student budget.",
                        List.of(
                                "The Ghana Stock Exchange (GSE) is one of the oldest and most reputable stock exchanges in West Africa. Many Ghanaians assume investing in stocks requires thousands of cedis, but you can start with as little as GH₵ 100.",
                                "Step 1: Open a brokerage account. Licensed brokers like Databank, IC Securities, and other GSE-approved firms allow you to open a trading account with a minimum deposit as low as GH₵ 50–100.",
                                "Step 2: Choose your first investment. For beginners, consider blue-chip stocks like Enterprise Group (EGL) or Ecobank Ghana (EGH), or go for a diversified mutual fund through Mfund or Epack Investment Fund.",
                                "Step 3: Invest consistently. Regular small investments — even GH₵ 50 per month — can grow substantially over 5–10 years through compounding. Avoid the temptation to check your portfolio daily; long-term investing beats short-term speculation every time.")),

                news(7L, "Building an Emergency Fund: Save GH₵ 500 in 90 Days on a Student Budget",
                        "Graphic Business", "https://www.graphic.com.gh/business/business-news.html", "Savings",
                        now.minus(4, ChronoUnit.DAYS), "4 min read",
                        "https://picsum.photos/seed/emergency-fund-savings/800/450",
                        "A practical 90-day savings plan tailored for Ghanaian university students using MoMo Vault and low-risk habits to build a financial safety net.",
                        List.of(
                                "An emergency fund is the single most important financial tool any young person in Ghana can build. Without one, a single unexpected expense — a medical bill, a broken laptop, a family crisis — can wipe out months of financial progress.",
                                "The goal is achievable: save GH₵ 500 in 90 days. That works out to GH₵ 5.56 per day, or roughly GH₵ 167 per month. For most students receiving an SLTF allowance or doing part-time work, this is realistic.",
                                "The best tool is your mobile money vault. MTN MoMo Vault and Telecel Cash Savings both lock your money away from your spendable wallet while earning small daily interest. Setting an auto-lock on payday prevents spending before saving.",
                                "Once your GH₵ 500 emergency fund is secured, graduate to a fixed deposit or a 91-day Treasury Bill to put that money to work — maintaining liquidity while earning up to 25% annually.")),

                news(8L, "How to Apply for and Repay Your SLTF Student Loan Step by Step",
                        "Graphic Business", "https://www.graphic.com.gh/business/business-news.html", "Policy",
                        now.minus(5, ChronoUnit.DAYS), "5 min read",
                        "https://picsum.photos/seed/sltf-student-loan-gh/800/450",
                        "A complete guide to the SLTF application portal, required documents, disbursement schedule, and how to avoid penalties when repaying after graduation.",
                        List.of(
                                "The Student Loan Trust Fund (SLTF) is Ghana's primary government mechanism for funding tertiary education. Understanding the process end-to-end can save you significant stress and late penalties.",
                                "To apply, visit the SLTF online portal (sltf.gov.gh) and create an account using your Ghana Card number. You will need a Ghana Card, proof of admission, a guarantor with a valid Ghana Card, and bank account details for disbursement.",
                                "Repayment begins 12 months after your final SLTF disbursement or upon gaining formal employment — whichever comes first. The repayment rate is typically 5% of your gross monthly salary, deducted directly by your employer.",
                                "Important: failing to notify the SLTF of your employment within the stipulated period attracts interest penalties. Keep your contact details on the portal updated throughout your career to avoid complications.")),

                news(9L, "Understanding Your PAYE Tax Deductions: A Guide for First-Time Workers",
                        "Ghana Business News", "https://www.ghanabusinessnews.com/", "Policy",
                        now.minus(5, ChronoUnit.DAYS), "5 min read",
                        "https://picsum.photos/seed/gra-paye-tax-guide/800/450",
                        "Why your net salary is lower than your offer letter, and how GRA PAYE tax brackets work for Ghanaian employees in 2026.",
                        List.of(
                                "Starting your first job in Ghana can be exciting — until you receive your first payslip. Many new workers are surprised to find their take-home pay is significantly lower than the salary they were offered. The difference is largely due to Pay As You Earn (PAYE) tax.",
                                "The Ghana Revenue Authority (GRA) uses a graduated tax band system. The first GH₵ 5,880 of annual income is tax-free. Income between GH₵ 5,880 and GH₵ 7,800 is taxed at 5%. The rate increases progressively to 10%, 17.5%, 25%, and 30% for income above GH₵ 240,000 per year.",
                                "Beyond PAYE, your payslip will also show SSNIT deductions (5.5% of gross), which go directly to your pension. Your employer also contributes 13% on your behalf — so your total pension contribution is 18.5% of your gross salary.",
                                "Use the GRA Tax Calculator on the GRA website to verify your employer is deducting the correct amount. If the numbers don't match, you have every right to query your HR department.")),

                news(10L, "How Your Digital Credit History Affects Loan Access in Ghana",
                        "Citi Business News", "https://citibusinessnews.com/", "Fintech",
                        now.minus(6, ChronoUnit.DAYS), "4 min read",
                        "https://picsum.photos/seed/fido-credit-digital-ghana/800/450",
                        "Ghana's emerging digital credit scoring ecosystem — from Fido to MTN Credit — and how your mobile money history decides your loan limit.",
                        List.of(
                                "In Ghana, traditional credit bureaus have limited reach — but a new wave of digital credit scoring is quietly reshaping who can access financial services.",
                                "Companies like Fido, MTN Credit, Zeepay, and First National Bank Ghana use alternative data — your mobile money transaction history, airtime top-up frequency, phone age, and even social graph signals — to generate a credit score. This score determines your loan eligibility and ceiling.",
                                "To build a strong digital credit profile: maintain consistent MoMo activity, repay any existing digital loans on time, avoid multiple simultaneous loan applications (each inquiry can negatively signal risk), and keep a registered SIM active with regular top-ups.",
                                "The Ghana Credit Reporting Act now mandates that credit bureaus — including TransUnion Ghana and XDS Data — must provide you with one free credit report per year. Use this to check your score and dispute any inaccuracies.")),

                news(11L, "Digital Susu Circles: How MoMo-Based Savings Groups Are Evolving",
                        "Joy Business", "https://www.myjoyonline.com/business/", "Savings",
                        now.minus(7, ChronoUnit.DAYS), "4 min read",
                        "https://picsum.photos/seed/susu-digital-momo-gh/800/450",
                        "Traditional Ghanaian susu clubs are going digital via mobile money group savings features — how to set one up and manage it safely.",
                        List.of(
                                "The susu is one of Ghana's oldest and most trusted financial traditions — a rotating savings club where members contribute a fixed amount each cycle, and one member collects the full pot in turn. Now, this system is going digital.",
                                "MTN MoMo and AirtelTigo Money both offer group wallet features that replicate the susu model digitally. Contributions are locked, rotation schedules are automated, and each member can track contributions in real time — eliminating the risk of a collector absconding with the group's money.",
                                "To start a digital susu: gather 5–20 trusted members, agree on a weekly or monthly contribution amount (even GH₵ 20–50 per person works for students), create a group wallet via your mobile money app, and set up automated standing orders on payday.",
                                "Digital susus are especially powerful for KNUST students. A group of 10 students each saving GH₵ 100 per month creates a GH₵ 1,000 rotating fund — enough to cover textbook costs, medical emergencies, or exam fees.")),

                news(12L, "Mutual Funds vs Fixed Deposits: Which is Right for a Young Ghanaian?",
                        "Ghana Stock Exchange", "https://www.gse.com.gh/", "Investing",
                        now.minus(7, ChronoUnit.DAYS), "5 min read",
                        "https://picsum.photos/seed/mutual-fund-fixed-deposit/800/450",
                        "A detailed comparison of returns, liquidity, and risk between Databank mutual funds and commercial bank fixed deposits for first-time investors.",
                        List.of(
                                "Two of the most popular investment options for young Ghanaians are mutual funds and bank fixed deposits. Both are relatively low-risk, but they differ significantly in flexibility, returns, and minimum investment.",
                                "Fixed deposits lock your money for a set period (30, 90, 180, or 365 days) at a guaranteed interest rate — typically 18–24% annually on GH₵ deposits. The trade-off is inflexibility: withdrawing early usually forfeits earned interest.",
                                "Mutual funds — like Databank Mfund, Epack Investment Fund, or Stanbic Income Fund — pool money from many investors into a diversified portfolio. Returns are variable but have historically outperformed fixed deposits over periods above 12 months. You can usually withdraw within 24–72 hours.",
                                "For money you won't need for 6–12 months, a fixed deposit offers certainty. For an ongoing savings habit with occasional access, a money market mutual fund is more flexible. Many smart savers keep both: a fixed deposit for a goal and a mutual fund as their emergency buffer.")),

                news(13L, "Property vs Treasury Bills: The Smarter Investment for Young Ghanaians in 2026",
                        "Ghana Business News", "https://www.ghanabusinessnews.com/", "Investing",
                        now.minus(7, ChronoUnit.DAYS), "6 min read",
                        "https://picsum.photos/seed/property-vs-tbills-2026/800/450",
                        "Comparing the returns, liquidity, and risks of real estate versus government Treasury Bills for first-time investors in the current Ghana market.",
                        List.of(
                                "Real estate has long been considered the most reliable path to wealth in Ghana. But with T-Bill yields hovering near 27%, young investors must ask: is property still the better bet?",
                                "Real estate requires significant upfront capital — even a plot in Kumasi or Accra suburbs now costs GH₵ 30,000 to GH₵ 80,000+. The return comes through capital appreciation (typically 8–15% annually in high-demand areas) and rental income. However, the asset is illiquid — selling can take months.",
                                "Treasury Bills, by contrast, are fully liquid at maturity (91 or 182 days), carry zero default risk, and currently offer yields of 25–27% annually on GH₵ investments. You can enter and exit the market with as little as GH₵ 50.",
                                "The conclusion for most students and young professionals: build your T-Bill portfolio first. Use the returns to save toward a property deposit over 5–7 years. This two-phase strategy lets your money work while you're accumulating the capital needed for real estate."))
        );

        for (NewsArticle article : articles) {
            if (!newsRepository.existsById(article.getId())) {
                newsRepository.save(article);
            }
        }
    }

    // ── small builder helpers ───────────────────────────────────────────────

    private Lesson lesson(Long id, String title, String description, String duration,
                          int xpVal, String emoji, List<String> content) {
        Lesson l = new Lesson();
        l.setId(id);
        l.setTitle(title);
        l.setDescription(description);
        l.setDuration(duration);
        l.setXpVal(xpVal);
        l.setEmoji(emoji);
        l.setContent(new ArrayList<>(content));
        return l;
    }

    private NewsArticle news(Long id, String title, String source, String sourceUrl,
                             String category, Instant publishedAt, String readTime,
                             String imageUrl, String summary, List<String> paragraphs) {
        NewsArticle a = new NewsArticle();
        a.setId(id);
        a.setTitle(title);
        a.setSource(source);
        a.setSourceUrl(sourceUrl);
        a.setCategory(category);
        a.setPublishedAt(publishedAt);
        a.setReadTime(readTime);
        a.setImageUrl(imageUrl);
        a.setSummary(summary);
        a.setParagraphs(new ArrayList<>(paragraphs));
        return a;
    }
}

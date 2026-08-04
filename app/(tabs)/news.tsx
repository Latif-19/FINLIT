import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Modal,
  RefreshControl,
  Image,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColors";
import { contentService } from "../../services/content";
import type { NewsArticle as BackendNewsArticle } from "@/types/api";

// Turns a backend ISO timestamp into a short relative label.
function newsTimeAgo(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

interface Article {
  id: number;
  title: string;
  source: string;
  sourceUrl: string;
  category: string;
  time: string;
  readTime: string;
  image: string;
  summary: string;
  paragraphs: string[];
}

const NEWS_ARTICLES: Article[] = [
  {
    id: 1,
    title: "Bank of Ghana Adjusts Monetary Policy Rate to Curb Inflation",
    source: "Bank of Ghana",
    sourceUrl: "https://www.bog.gov.gh/monetary-policy/",
    category: "Policy",
    time: "2h ago",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/bog-monetary-policy/800/450",
    summary:
      "The MPC has revised the policy rate to manage local inflation, influencing interest yields on bank deposits and commercial loans across Ghana.",
    paragraphs: [
      "The Monetary Policy Committee (MPC) of the Bank of Ghana has adjusted the benchmark monetary policy rate to help curb macroeconomic inflationary pressures.",
      "When the central bank raises interest rates, commercial banks typically increase their interest yields on fixed deposit accounts, mutual funds, and savings products. If you have cash stored in money market funds, you are likely to see an increase in monthly yields.",
      "However, there is a flip side. The cost of borrowing money also increases. If you have outstanding credit or are planning to apply for local commercial loans or digital credit (like Qwikloan or Fido), the borrowing fees and interest charges may rise in response to central bank rate adjustments.",
      "Financial experts advise maintaining high liquidity in high-yield money market accounts during rate hikes to maximize risk-free earnings while avoiding high-interest debt.",
    ],
  },
  {
    id: 2,
    title: "How E-Levy and MoMo Fees Impact Student Allowances & Small Businesses",
    source: "Joy Business",
    sourceUrl: "https://www.myjoyonline.com/business/",
    category: "Fintech",
    time: "5h ago",
    readTime: "5 min read",
    image: "https://picsum.photos/seed/momo-elevy-ghana/800/450",
    summary:
      "An analysis of how mobile money transaction charges and E-levy affect daily cash flow, and three strategies to save on transfer costs.",
    paragraphs: [
      "Mobile money is the heartbeat of transactions in Ghana, but E-levy and carrier fees can add up to a significant monthly expense if left unmonitored.",
      "The current Electronic Transfer Levy (E-levy) sits at 1% on electronic transfers. Crucially, the first GH₵ 100 sent per day is exempt from this tax. Understanding this exemption is vital for students and micro-merchants who send money frequently.",
      "To optimize transaction costs:\n\n1. Split transfers: Send GH₵ 100 today and GH₵ 100 tomorrow to avoid E-levy completely.\n\n2. Bank-to-Wallet pathways: Transferring from your bank app to your own MoMo wallet is exempt from E-levy.\n\n3. Cash Out Wisely: Carrier cash-out fees are capped at roughly GH₵ 10 for withdrawals above GH₵ 1,000. One large withdrawal is almost always cheaper than several small ones.",
    ],
  },
  {
    id: 3,
    title: "Ghana Treasury Bills Explained: Why T-Bills Remain a Popular Safe Haven",
    source: "Ghana Stock Exchange",
    sourceUrl: "https://www.gse.com.gh/",
    category: "Investing",
    time: "1d ago",
    readTime: "6 min read",
    image: "https://picsum.photos/seed/tbills-gse-invest/800/450",
    summary:
      "A beginner's guide to 91-day and 182-day Treasury Bills, current interest yields, and how to purchase them via mobile money in Ghana.",
    paragraphs: [
      "In times of market volatility, individual investors look for a safe place to store capital. In Ghana, Treasury Bills (T-Bills) remain the most popular risk-free investment asset.",
      "Treasury Bills are short-term government debt instruments. When you buy a T-Bill, you are lending money directly to the Government of Ghana. The government promises to pay you back at maturity with interest. Because they are backed by the state, they carry near-zero default risk.",
      "T-Bills are sold at a discount. For example, if you buy a GH₵ 1,000 bill, you might pay GH₵ 800 upfront. At the end of the tenure (e.g. 91 days), the government pays you the full GH₵ 1,000. The interest yields have historically been high, hovering between 24% and 28% annually.",
      "You don't need millions to start. Most local retail banks and investment firms allow you to purchase T-bills with as little as GH₵ 50, and you can manage your roll-over options using mobile money USSD codes directly from your phone.",
    ],
  },
  {
    id: 4,
    title: "MTN Qwikloan vs Bank Personal Loan: Which Costs More in 2026?",
    source: "Citi Business News",
    sourceUrl: "https://citibusinessnews.com/",
    category: "Fintech",
    time: "1d ago",
    readTime: "5 min read",
    image: "https://picsum.photos/seed/qwikloan-bank-compare/800/450",
    summary:
      "A side-by-side comparison of interest rates, repayment terms, and hidden fees between MTN Qwikloan and standard bank personal loans in Ghana.",
    paragraphs: [
      "With the rise of digital lending platforms, many Ghanaians now have instant access to credit via their mobile phones. But convenience often comes at a premium.",
      "MTN Qwikloan charges a flat monthly interest rate of approximately 6.9%, which translates to an Annual Percentage Rate (APR) exceeding 82%. While the loan disburses within minutes, the effective cost of borrowing is significantly higher than traditional bank products.",
      "By contrast, a standard bank personal loan in Ghana carries monthly interest rates between 2% and 3.5%, depending on your credit profile and relationship with the bank. While the application process takes longer (3–7 business days), the total interest paid over the loan period is substantially lower.",
      "The key takeaway: use mobile quick-loans only for genuine emergencies with a clear repayment plan. For planned expenses, a bank loan or cooperative credit union will always be cheaper in the long run.",
    ],
  },
  {
    id: 5,
    title: "SSNIT Pension Updates: What the New Contribution Rates Mean for You",
    source: "Ghana Business News",
    sourceUrl: "https://www.ghanabusinessnews.com/",
    category: "Policy",
    time: "2d ago",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/ssnit-pension-ghana/800/450",
    summary:
      "Breaking down the latest SSNIT contribution rate changes and how they affect your monthly salary deductions and future retirement payout.",
    paragraphs: [
      "The Social Security and National Insurance Trust (SSNIT) periodically adjusts contribution rates to ensure the sustainability of the national pension scheme.",
      "Currently, employees contribute 5.5% of their gross monthly salary to SSNIT, while employers contribute an additional 13%. These contributions fund your Tier 1 pension, which provides a monthly payment upon retirement.",
      "Recent reforms have expanded Tier 3 voluntary pension schemes, allowing workers to make additional tax-advantaged contributions through private pension fund managers. This is particularly beneficial for self-employed individuals and side-hustle earners.",
      "Experts recommend starting voluntary Tier 3 contributions as early as possible — even small monthly amounts can compound significantly over a 30-year career.",
    ],
  },
  {
    id: 6,
    title: "How to Start Investing in the Ghana Stock Exchange with Just GH₵ 100",
    source: "Ghana Stock Exchange",
    sourceUrl: "https://www.gse.com.gh/",
    category: "Investing",
    time: "3d ago",
    readTime: "6 min read",
    image: "https://picsum.photos/seed/gse-stock-market/800/450",
    summary:
      "A step-by-step guide to opening a brokerage account and buying your first shares on the GSE, even on a student budget.",
    paragraphs: [
      "The Ghana Stock Exchange (GSE) is one of the oldest and most reputable stock exchanges in West Africa. Many Ghanaians assume investing in stocks requires thousands of cedis, but you can start with as little as GH₵ 100.",
      "Step 1: Open a brokerage account. Licensed brokers like Databank, IC Securities, and other GSE-approved firms allow you to open a trading account with a minimum deposit as low as GH₵ 50–100.",
      "Step 2: Choose your first investment. For beginners, consider blue-chip stocks like Enterprise Group (EGL) or Ecobank Ghana (EGH), or go for a diversified mutual fund through Mfund or Epack Investment Fund.",
      "Step 3: Invest consistently. Regular small investments — even GH₵ 50 per month — can grow substantially over 5–10 years through compounding. Avoid the temptation to check your portfolio daily; long-term investing beats short-term speculation every time.",
    ],
  },
  {
    id: 7,
    title: "Building an Emergency Fund: Save GH₵ 500 in 90 Days on a Student Budget",
    source: "Graphic Business",
    sourceUrl: "https://www.graphic.com.gh/business/business-news.html",
    category: "Savings",
    time: "4d ago",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/emergency-fund-savings/800/450",
    summary:
      "A practical 90-day savings plan tailored for Ghanaian university students using MoMo Vault and low-risk habits to build a financial safety net.",
    paragraphs: [
      "An emergency fund is the single most important financial tool any young person in Ghana can build. Without one, a single unexpected expense — a medical bill, a broken laptop, a family crisis — can wipe out months of financial progress.",
      "The goal is achievable: save GH₵ 500 in 90 days. That works out to GH₵ 5.56 per day, or roughly GH₵ 167 per month. For most students receiving an SLTF allowance or doing part-time work, this is realistic.",
      "The best tool is your mobile money vault. MTN MoMo Vault and Telecel Cash Savings both lock your money away from your spendable wallet while earning small daily interest. Setting an auto-lock on payday prevents spending before saving.",
      "Once your GH₵ 500 emergency fund is secured, graduate to a fixed deposit or a 91-day Treasury Bill to put that money to work — maintaining liquidity while earning up to 25% annually.",
    ],
  },
  {
    id: 8,
    title: "How to Apply for and Repay Your SLTF Student Loan Step by Step",
    source: "Graphic Business",
    sourceUrl: "https://www.graphic.com.gh/business/business-news.html",
    category: "Policy",
    time: "5d ago",
    readTime: "5 min read",
    image: "https://picsum.photos/seed/sltf-student-loan-gh/800/450",
    summary:
      "A complete guide to the SLTF application portal, required documents, disbursement schedule, and how to avoid penalties when repaying after graduation.",
    paragraphs: [
      "The Student Loan Trust Fund (SLTF) is Ghana's primary government mechanism for funding tertiary education. Understanding the process end-to-end can save you significant stress and late penalties.",
      "To apply, visit the SLTF online portal (sltf.gov.gh) and create an account using your Ghana Card number. You will need a Ghana Card, proof of admission, a guarantor with a valid Ghana Card, and bank account details for disbursement.",
      "Repayment begins 12 months after your final SLTF disbursement or upon gaining formal employment — whichever comes first. The repayment rate is typically 5% of your gross monthly salary, deducted directly by your employer.",
      "Important: failing to notify the SLTF of your employment within the stipulated period attracts interest penalties. Keep your contact details on the portal updated throughout your career to avoid complications.",
    ],
  },
  {
    id: 9,
    title: "Understanding Your PAYE Tax Deductions: A Guide for First-Time Workers",
    source: "Ghana Business News",
    sourceUrl: "https://www.ghanabusinessnews.com/",
    category: "Policy",
    time: "5d ago",
    readTime: "5 min read",
    image: "https://picsum.photos/seed/gra-paye-tax-guide/800/450",
    summary:
      "Why your net salary is lower than your offer letter, and how GRA PAYE tax brackets work for Ghanaian employees in 2026.",
    paragraphs: [
      "Starting your first job in Ghana can be exciting — until you receive your first payslip. Many new workers are surprised to find their take-home pay is significantly lower than the salary they were offered. The difference is largely due to Pay As You Earn (PAYE) tax.",
      "The Ghana Revenue Authority (GRA) uses a graduated tax band system. The first GH₵ 5,880 of annual income is tax-free. Income between GH₵ 5,880 and GH₵ 7,800 is taxed at 5%. The rate increases progressively to 10%, 17.5%, 25%, and 30% for income above GH₵ 240,000 per year.",
      "Beyond PAYE, your payslip will also show SSNIT deductions (5.5% of gross), which go directly to your pension. Your employer also contributes 13% on your behalf — so your total pension contribution is 18.5% of your gross salary.",
      "Use the GRA Tax Calculator on the GRA website to verify your employer is deducting the correct amount. If the numbers don't match, you have every right to query your HR department.",
    ],
  },
  {
    id: 10,
    title: "How Your Digital Credit History Affects Loan Access in Ghana",
    source: "Citi Business News",
    sourceUrl: "https://citibusinessnews.com/",
    category: "Fintech",
    time: "6d ago",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/fido-credit-digital-ghana/800/450",
    summary:
      "Ghana's emerging digital credit scoring ecosystem — from Fido to MTN Credit — and how your mobile money history decides your loan limit.",
    paragraphs: [
      "In Ghana, traditional credit bureaus have limited reach — but a new wave of digital credit scoring is quietly reshaping who can access financial services.",
      "Companies like Fido, MTN Credit, Zeepay, and First National Bank Ghana use alternative data — your mobile money transaction history, airtime top-up frequency, phone age, and even social graph signals — to generate a credit score. This score determines your loan eligibility and ceiling.",
      "To build a strong digital credit profile: maintain consistent MoMo activity, repay any existing digital loans on time, avoid multiple simultaneous loan applications (each inquiry can negatively signal risk), and keep a registered SIM active with regular top-ups.",
      "The Ghana Credit Reporting Act now mandates that credit bureaus — including TransUnion Ghana and XDS Data — must provide you with one free credit report per year. Use this to check your score and dispute any inaccuracies.",
    ],
  },
  {
    id: 11,
    title: "Digital Susu Circles: How MoMo-Based Savings Groups Are Evolving",
    source: "Joy Business",
    sourceUrl: "https://www.myjoyonline.com/business/",
    category: "Savings",
    time: "1w ago",
    readTime: "4 min read",
    image: "https://picsum.photos/seed/susu-digital-momo-gh/800/450",
    summary:
      "Traditional Ghanaian susu clubs are going digital via mobile money group savings features — how to set one up and manage it safely.",
    paragraphs: [
      "The susu is one of Ghana's oldest and most trusted financial traditions — a rotating savings club where members contribute a fixed amount each cycle, and one member collects the full pot in turn. Now, this system is going digital.",
      "MTN MoMo and AirtelTigo Money both offer group wallet features that replicate the susu model digitally. Contributions are locked, rotation schedules are automated, and each member can track contributions in real time — eliminating the risk of a collector absconding with the group's money.",
      "To start a digital susu: gather 5–20 trusted members, agree on a weekly or monthly contribution amount (even GH₵ 20–50 per person works for students), create a group wallet via your mobile money app, and set up automated standing orders on payday.",
      "Digital susus are especially powerful for KNUST students. A group of 10 students each saving GH₵ 100 per month creates a GH₵ 1,000 rotating fund — enough to cover textbook costs, medical emergencies, or exam fees.",
    ],
  },
  {
    id: 12,
    title: "Mutual Funds vs Fixed Deposits: Which is Right for a Young Ghanaian?",
    source: "Ghana Stock Exchange",
    sourceUrl: "https://www.gse.com.gh/",
    category: "Investing",
    time: "1w ago",
    readTime: "5 min read",
    image: "https://picsum.photos/seed/mutual-fund-fixed-deposit/800/450",
    summary:
      "A detailed comparison of returns, liquidity, and risk between Databank mutual funds and commercial bank fixed deposits for first-time investors.",
    paragraphs: [
      "Two of the most popular investment options for young Ghanaians are mutual funds and bank fixed deposits. Both are relatively low-risk, but they differ significantly in flexibility, returns, and minimum investment.",
      "Fixed deposits lock your money for a set period (30, 90, 180, or 365 days) at a guaranteed interest rate — typically 18–24% annually on GH₵ deposits. The trade-off is inflexibility: withdrawing early usually forfeits earned interest.",
      "Mutual funds — like Databank Mfund, Epack Investment Fund, or Stanbic Income Fund — pool money from many investors into a diversified portfolio. Returns are variable but have historically outperformed fixed deposits over periods above 12 months. You can usually withdraw within 24–72 hours.",
      "For money you won't need for 6–12 months, a fixed deposit offers certainty. For an ongoing savings habit with occasional access, a money market mutual fund is more flexible. Many smart savers keep both: a fixed deposit for a goal and a mutual fund as their emergency buffer.",
    ],
  },
  {
    id: 13,
    title: "Property vs Treasury Bills: The Smarter Investment for Young Ghanaians in 2026",
    source: "Ghana Business News",
    sourceUrl: "https://www.ghanabusinessnews.com/",
    category: "Investing",
    time: "1w ago",
    readTime: "6 min read",
    image: "https://picsum.photos/seed/property-vs-tbills-2026/800/450",
    summary:
      "Comparing the returns, liquidity, and risks of real estate versus government Treasury Bills for first-time investors in the current Ghana market.",
    paragraphs: [
      "Real estate has long been considered the most reliable path to wealth in Ghana. But with T-Bill yields hovering near 27%, young investors must ask: is property still the better bet?",
      "Real estate requires significant upfront capital — even a plot in Kumasi or Accra suburbs now costs GH₵ 30,000 to GH₵ 80,000+. The return comes through capital appreciation (typically 8–15% annually in high-demand areas) and rental income. However, the asset is illiquid — selling can take months.",
      "Treasury Bills, by contrast, are fully liquid at maturity (91 or 182 days), carry zero default risk, and currently offer yields of 25–27% annually on GH₵ investments. You can enter and exit the market with as little as GH₵ 50.",
      "The conclusion for most students and young professionals: build your T-Bill portfolio first. Use the returns to save toward a property deposit over 5–7 years. This two-phase strategy lets your money work while you're accumulating the capital needed for real estate.",
    ],
  },
];

const CATEGORY_META: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  Policy:    { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0", icon: "newspaper-outline" },
  Fintech:   { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe", icon: "phone-portrait-outline" },
  Investing: { bg: "#faf5ff", text: "#6b21a8", border: "#e9d5ff", icon: "trending-up-outline" },
  Savings:   { bg: "#fefce8", text: "#854d0e", border: "#fde68a", icon: "wallet-outline" },
};

const ALL_CATEGORIES = ["All", ...Array.from(new Set(NEWS_ARTICLES.map((a) => a.category)))];

// Maps a backend news article to the shape this screen renders.
function mapBackendNews(items: BackendNewsArticle[]): Article[] {
  return items.map((a) => ({
    id: a.id,
    title: a.title,
    source: a.source,
    sourceUrl: a.sourceUrl,
    category: a.category,
    time: newsTimeAgo(a.publishedAt),
    readTime: a.readTime,
    image: a.imageUrl,
    summary: a.summary,
    paragraphs: a.content,
  }));
}

function CategoryPill({ category, small = false }: { category: string; small?: boolean }) {
  const meta = CATEGORY_META[category];
  if (!meta) return null;
  return (
    <View
      style={{ backgroundColor: meta.bg, borderColor: meta.border }}
      className={`flex-row items-center rounded-full border ${small ? "px-2 py-0.5" : "px-2.5 py-1"}`}
    >
      <Ionicons name={meta.icon as any} size={small ? 9 : 11} color={meta.text} style={{ marginRight: 3 }} />
      <Text style={{ color: meta.text }} className={`font-inter-bold uppercase tracking-wider ${small ? "text-[8px]" : "text-[10px]"}`}>
        {category}
      </Text>
    </View>
  );
}

export default function NewsScreen() {
  const colors = useThemeColors();
  // Starts with the bundled articles, then replaced by the backend feed on focus.
  const [articles, setArticles] = useState<Article[]>(NEWS_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [updatedLabel, setUpdatedLabel] = useState("Today");

  // Bumped on every load request; stale in-flight responses (from a previous
  // focus or refresh) are dropped so they can't overwrite newer data.
  const loadTokenRef = useRef(0);
  // Single "Today" revert timer — rapid refreshes must not stack 12s timers
  // that reset the label out of order.
  const labelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadNews = useCallback(async () => {
    const token = ++loadTokenRef.current;
    try {
      const res = await contentService.getNews();
      if (token !== loadTokenRef.current) return; // stale response — ignore
      if (res.data && res.data.length > 0) {
        setArticles(mapBackendNews(res.data));
      }
    } catch {
      // Offline — keep the bundled articles.
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNews();
    }, [loadNews])
  );

  const filteredArticles = useMemo(() => {
    const base =
      activeCategory === "All"
        ? articles
        : articles.filter((a) => a.category === activeCategory);
    if (base.length === 0) return [];
    const idx = startIndex % base.length;
    return [...base.slice(idx), ...base.slice(0, idx)];
  }, [articles, activeCategory, startIndex]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNews();
    setStartIndex((prev) => prev + 1);
    setUpdatedLabel("Just now");
    setRefreshing(false);
    if (labelTimerRef.current) clearTimeout(labelTimerRef.current);
    labelTimerRef.current = setTimeout(() => setUpdatedLabel("Today"), 12000);
  }, [loadNews]);

  const getCount = (cat: string) =>
    cat === "All" ? articles.length : articles.filter((a) => a.category === cat).length;

  const featured = filteredArticles[0] ?? null;
  const list = filteredArticles.slice(1);

  const openInBrowser = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-slateBg" edges={["top"]}>
      {/* ── HEADER ── */}
      <View className="px-5 pt-3 pb-4 bg-brand-bg border-b border-brand-border">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[24px] font-inter-bold text-brand-navy tracking-tight">
              Financial News
            </Text>
            <Text className="text-[12px] text-brand-gray font-inter mt-0.5">
              Ghana finance & market updates
            </Text>
          </View>
          <View className="items-end gap-1">
            <View className="flex-row items-center bg-brand-slateBg px-2.5 py-1.5 rounded-xl border border-brand-border gap-1.5">
              <Ionicons name="time-outline" size={12} color={colors.gray} />
              <Text className="text-[10px] font-inter-bold text-brand-gray uppercase tracking-wider">
                {updatedLabel}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── CATEGORY FILTER ── */}
      <View className="bg-brand-bg border-b border-brand-border">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
        >
          {ALL_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const count = getCount(cat);
            return (
              <Pressable
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.96 : 1 }] })}
                className={`flex-row items-center px-3.5 py-2 rounded-full border gap-1.5 ${
                  isActive ? "bg-brand-navy border-brand-navy" : "bg-brand-bg border-brand-border"
                }`}
              >
                <Text
                  className={`text-[11px] font-inter-bold ${
                    isActive ? "text-white" : "text-brand-gray"
                  }`}
                >
                  {cat}
                </Text>
                <View
                  className={`rounded-full px-1.5 py-0.5 ${
                    isActive ? "bg-white/20" : "bg-brand-slateBg"
                  }`}
                >
                  <Text
                    className={`text-[9px] font-inter-bold ${
                      isActive ? "text-white" : "text-brand-gray"
                    }`}
                  >
                    {count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ── ARTICLE FEED ── */}
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#16A34A"
            colors={["#16A34A"]}
          />
        }
      >
        {featured ? (
          <>
            {/* ── FEATURED HERO CARD ── */}
            <Text className="text-[10px] font-inter-bold text-brand-gray tracking-widest mb-3 ml-0.5 uppercase">
              Featured Story
            </Text>
            <Pressable
              onPress={() => setSelectedArticle(featured)}
              style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.99 : 1 }] })}
              className="bg-brand-bg rounded-2xl overflow-hidden border border-brand-border shadow-sm mb-5"
            >
              <Image
                source={{ uri: featured.image }}
                style={{ width: "100%", height: 200 }}
                resizeMode="cover"
              />
              <View style={{ position: "absolute", top: 12, left: 12 }}>
                <CategoryPill category={featured.category} />
              </View>

              <View className="p-4">
                <View className="flex-row items-center gap-1.5 mb-2">
                  <Ionicons name="newspaper-outline" size={12} color={colors.gray} />
                  <Text className="text-[11px] text-brand-gray font-inter-semibold">
                    {featured.source}
                  </Text>
                  <Text className="text-brand-gray">·</Text>
                  <Text className="text-[11px] text-brand-gray font-inter">{featured.time}</Text>
                  <Text className="text-brand-gray">·</Text>
                  <Text className="text-[11px] text-brand-gray font-inter">{featured.readTime}</Text>
                </View>

                <Text className="text-[18px] font-inter-bold text-brand-navy leading-[25px]">
                  {featured.title}
                </Text>
                <Text
                  className="text-[13px] text-brand-gray font-inter mt-2 leading-5"
                  numberOfLines={2}
                >
                  {featured.summary}
                </Text>

                <View className="flex-row items-center mt-3.5 pt-3.5 border-t border-brand-border gap-1">
                  <Text className="text-brand-emerald text-[13px] font-inter-bold">
                    Read Article
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.emerald} />
                </View>
              </View>
            </Pressable>

            {/* ── LIST CARDS ── */}
            {list.length > 0 && (
              <>
                <Text className="text-[10px] font-inter-bold text-brand-gray tracking-widest mb-3 ml-0.5 uppercase">
                  Recent Updates
                </Text>
                <View className="gap-3">
                  {list.map((item) => (
                    <Pressable
                      key={item.id}
                      onPress={() => setSelectedArticle(item)}
                      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.99 : 1 }] })}
                      className="bg-brand-bg rounded-2xl border border-brand-border p-3.5 flex-row gap-3 shadow-sm"
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={{ width: 90, height: 90, borderRadius: 12 }}
                        resizeMode="cover"
                      />
                      <View className="flex-1">
                        <CategoryPill category={item.category} small />
                        <Text
                          className="text-[13px] font-inter-bold text-brand-navy mt-1.5 leading-[19px]"
                          numberOfLines={2}
                        >
                          {item.title}
                        </Text>
                        <Text
                          className="text-[11px] text-brand-gray font-inter mt-1 leading-[15px]"
                          numberOfLines={2}
                        >
                          {item.summary}
                        </Text>
                        <View className="flex-row items-center mt-2 gap-1">
                          <Text className="text-[10px] text-brand-gray font-inter-semibold">
                            {item.source}
                          </Text>
                          <Text className="text-brand-gray text-[10px]">·</Text>
                          <Text className="text-[10px] text-brand-gray font-inter">{item.time}</Text>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </>
            )}
          </>
        ) : null}

        {filteredArticles.length === 0 && (
          <View className="py-20 items-center">
            <Ionicons name="newspaper-outline" size={40} color={colors.gray} />
            <Text className="text-brand-gray text-sm font-inter-medium mt-3">
              No articles in this category
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ── FULL ARTICLE MODAL ── */}
      <Modal
        visible={!!selectedArticle}
        animationType="slide"
        onRequestClose={() => setSelectedArticle(null)}
      >
        <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
          {selectedArticle && (
            <View className="flex-1">
              {/* Modal Header */}
              <View className="flex-row items-center justify-between px-4 py-3 border-b border-brand-border bg-brand-bg">
                <Pressable
                  onPress={() => setSelectedArticle(null)}
                  className="w-10 h-10 rounded-full bg-brand-slateBg items-center justify-center"
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Ionicons name="arrow-back" size={20} color={colors.navy} />
                </Pressable>

                <CategoryPill category={selectedArticle.category} />

                <Pressable
                  onPress={() => openInBrowser(selectedArticle.sourceUrl)}
                  className="w-10 h-10 rounded-full bg-brand-slateBg items-center justify-center"
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Ionicons name="open-outline" size={18} color={colors.navy} />
                </Pressable>
              </View>

              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
              >
                <Image
                  source={{ uri: selectedArticle.image }}
                  style={{ width: "100%", height: 230 }}
                  resizeMode="cover"
                />

                <View className="px-5 pt-5">
                  {/* Source meta */}
                  <View className="flex-row items-center gap-2 mb-3">
                    <View className="w-7 h-7 bg-brand-emerald/10 rounded-full items-center justify-center">
                      <Ionicons name="newspaper-outline" size={14} color={colors.emerald} />
                    </View>
                    <Text className="text-[13px] font-inter-bold text-brand-navy">
                      {selectedArticle.source}
                    </Text>
                    <Text className="text-brand-gray">·</Text>
                    <Text className="text-[12px] text-brand-gray font-inter">
                      {selectedArticle.time}
                    </Text>
                    <Text className="text-brand-gray">·</Text>
                    <Text className="text-[12px] text-brand-gray font-inter">
                      {selectedArticle.readTime}
                    </Text>
                  </View>

                  {/* Title */}
                  <Text className="text-[22px] font-inter-bold text-brand-navy leading-[30px]">
                    {selectedArticle.title}
                  </Text>

                  {/* Summary highlight */}
                  <View className="bg-brand-emerald/10 border border-brand-emerald/20 rounded-2xl p-4 mt-4 flex-row gap-3">
                    <Ionicons
                      name="bulb-outline"
                      size={18}
                      color={colors.emerald}
                      style={{ marginTop: 1 }}
                    />
                    <Text className="flex-1 text-[13px] text-brand-dark font-inter leading-[20px]">
                      {selectedArticle.summary}
                    </Text>
                  </View>

                  <View className="h-px bg-brand-slateBg my-5" />

                  {/* Article paragraphs */}
                  {selectedArticle.paragraphs.map((para, idx) => (
                    <Text
                      key={idx}
                      className="text-[15px] text-brand-dark font-inter leading-7 mb-4"
                    >
                      {para}
                    </Text>
                  ))}

                  {/* Read on Website inline card */}
                  <Pressable
                    onPress={() => openInBrowser(selectedArticle.sourceUrl)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                    className="bg-brand-bg border border-brand-border rounded-2xl p-4 mt-4 flex-row items-center gap-3 shadow-sm"
                  >
                    <View className="w-11 h-11 bg-brand-emerald/10 rounded-full items-center justify-center">
                      <Ionicons name="globe-outline" size={20} color={colors.emerald} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[13px] font-inter-bold text-brand-navy">
                        Read Full Article
                      </Text>
                      <Text className="text-[11px] text-brand-gray font-inter mt-0.5">
                        {selectedArticle.sourceUrl
                          .replace("https://", "")
                          .replace("www.", "")
                          .split("/")[0]}
                      </Text>
                    </View>
                    <View className="bg-brand-navy px-3 py-1.5 rounded-xl">
                      <Text className="text-white text-[11px] font-inter-bold">Open →</Text>
                    </View>
                  </Pressable>
                </View>
              </ScrollView>

              {/* Sticky bottom CTA */}
              <View className="absolute bottom-0 left-0 right-0 bg-brand-bg border-t border-brand-border px-5 pt-3 pb-8">
                <Pressable
                  onPress={() => openInBrowser(selectedArticle.sourceUrl)}
                  style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}
                  className="bg-brand-navy h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-md"
                >
                  <Ionicons name="open-outline" size={18} color="white" />
                  <Text className="text-white font-inter-bold text-sm">
                    Open on {selectedArticle.source}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Modal,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Article {
  id: number;
  title: string;
  source: string;
  category: string;
  time: string;
  readTime: string;
  summary: string;
  paragraphs: string[];
}

const NEWS_ARTICLES: Article[] = [
  {
    id: 1,
    title: "Bank of Ghana Adjusts Monetary Policy Rate to Curb Inflation",
    source: "BoG Economics Dept",
    category: "Policy",
    time: "2h ago",
    readTime: "4 min read",
    summary: "The Bank of Ghana Monetary Policy Committee has revised the policy rate to manage local inflation, influencing interest yields on bank deposits and commercial loans.",
    paragraphs: [
      "The Monetary Policy Committee (MPC) of the Bank of Ghana has adjusted the benchmark monetary policy rate to help curb macroeconomic inflationary pressures.",
      "What does this mean for the average saver? When the central bank raises interest rates, commercial banks typically increase their interest yields on fixed deposit accounts, mutual funds, and savings products. If you have cash stored in money market funds, you are likely to see an increase in monthly yields.",
      "However, there is a flip side. The cost of borrowing money also increases. If you have outstanding credit or are planning to apply for local commercial loans or digital credit (like Qwikloan or Fido), the borrowing fees and interest charges may rise in response to central bank rate adjustments.",
      "Financial experts advise maintaining high liquidity in high-yield money market accounts during rate hikes to maximize risk-free earnings while avoiding high-interest debt.",
    ],
  },
  {
    id: 2,
    title: "How E-levy and MoMo Fees Impact Student Allowances & Small Businesses",
    source: "Ghana Business Week",
    category: "Fintech",
    time: "5h ago",
    readTime: "5 min read",
    summary: "An analysis of how mobile money transaction charges and E-levy affect daily cash flow, and strategies to save on transfer costs.",
    paragraphs: [
      "Mobile money is the heartbeat of transactions in Ghana, but E-levy and carrier fees can add up to a significant monthly expense if left unmonitored.",
      "The current Electronic Transfer Levy (E-levy) sits at 1% on electronic transfers. Crucially, the first GH₵ 100 sent per day is exempt from this tax. Understanding this exemption is vital for students and micro-merchants who send money frequently.",
      "To optimize transaction costs, consider these three strategies:\n1. Split transfers: If you need to send GH₵ 200 to a family member, consider sending GH₵ 100 today and GH₵ 100 tomorrow. This avoids E-levy completely.\n2. Bank-to-Wallet pathways: Check if transferring directly from your bank application to a MoMo wallet is exempt under the updated guidelines, as bank transfers to your own wallet are free from E-levy.\n3. Cash Out Wisely: Carrier cash-out fees are capped (typically at GH₵ 10 for withdrawals above GH₵ 1,000). Withdrawing in one large sum is often cheaper than making several small withdrawals.",
    ],
  },
  {
    id: 3,
    title: "Ghana Treasury Bills Explained: Why T-Bills Remain a Popular Safe Haven",
    source: "GSE Investor Academy",
    category: "Investing",
    time: "1d ago",
    readTime: "6 min read",
    summary: "A beginner's guide to 91-day and 182-day Treasury Bills, current interest yields, and how to purchase them easily via mobile money.",
    paragraphs: [
      "In times of market volatility, individual investors look for a safe place to store capital. In Ghana, Treasury Bills (T-Bills) remain the most popular risk-free investment asset.",
      "Treasury Bills are short-term government debt instruments. When you buy a T-Bill, you are lending money directly to the Government of Ghana. The government promises to pay you back at maturity with interest. Because they are backed by the state, they have near-zero default risk.",
      "T-Bills are sold at a discount. For example, if you buy a GH₵ 1,000 bill, you might pay GH₵ 800 upfront. At the end of the tenure (e.g. 91 days), the government pays you the full GH₵ 1,000. The interest yields have historically been high, hovering between 24% and 28% annually.",
      "You don't need millions to start. Most local retail banks and investment firms allow you to purchase T-bills with as little as GH₵ 50, and you can manage your roll-over options using mobile money codes (USSD) directly from your phone.",
    ],
  },
];

export default function NewsScreen() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const featured = NEWS_ARTICLES[0];
  const list = NEWS_ARTICLES.slice(1);

  const getTagColor = (category: string) => {
    switch (category) {
      case "Policy":
        return { bg: "#f0fdf4", text: "#166534" };
      case "Fintech":
        return { bg: "#eff6ff", text: "#1e40af" };
      case "Investing":
        return { bg: "#faf5ff", text: "#6b21a8" };
      default:
        return { bg: "#f3f4f6", text: "#374151" };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial News</Text>
        <Text style={styles.headerSubtitle}>
          {"Stay updated on market movements & local saving tips"}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Card */}
        <Text style={styles.sectionLabel}>FEATURED STORY</Text>
        <Pressable
          onPress={() => setSelectedArticle(featured)}
          style={({ pressed }) => [
            styles.featuredCard,
            pressed && { transform: [{ scale: 0.99 }] },
          ]}
        >
          <View style={styles.featuredMetaRow}>
            <View
              style={[
                styles.tagBadge,
                { backgroundColor: getTagColor(featured.category).bg },
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  { color: getTagColor(featured.category).text },
                ]}
              >
                {featured.category}
              </Text>
            </View>
            <Text style={styles.timeText}>
              {featured.time} • {featured.readTime}
            </Text>
          </View>
          <Text style={styles.featuredTitle}>{featured.title}</Text>
          <Text style={styles.featuredSummary} numberOfLines={3}>
            {featured.summary}
          </Text>
          <View style={styles.readMoreRow}>
            <Text style={styles.readMoreText}>Read Article</Text>
            <Ionicons name="arrow-forward" size={14} color="#15803d" />
          </View>
        </Pressable>

        {/* Recent Articles */}
        <Text style={styles.sectionLabel}>RECENT UPDATES</Text>
        <View style={styles.listContainer}>
          {list.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => setSelectedArticle(item)}
              style={({ pressed }) => [
                styles.articleCard,
                pressed && { transform: [{ scale: 0.99 }] },
              ]}
            >
              <View style={styles.featuredMetaRow}>
                <View
                  style={[
                    styles.tagBadge,
                    { backgroundColor: getTagColor(item.category).bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: getTagColor(item.category).text },
                    ]}
                  >
                    {item.category}
                  </Text>
                </View>
                <Text style={styles.timeText}>
                  {item.time} • {item.readTime}
                </Text>
              </View>
              <Text style={styles.articleTitle}>{item.title}</Text>
              <Text style={styles.articleSummary} numberOfLines={2}>
                {item.summary}
              </Text>
              <View style={styles.articleFooter}>
                <Text style={styles.articleSource}>{item.source}</Text>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* ── FULL ARTICLE READER MODAL ── */}
      <Modal
        visible={!!selectedArticle}
        animationType="slide"
        onRequestClose={() => setSelectedArticle(null)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          {selectedArticle && (
            <View style={{ flex: 1 }}>
              {/* Modal Header */}
              <View style={styles.readingHeader}>
                <Pressable
                  onPress={() => setSelectedArticle(null)}
                  style={styles.readingBack}
                >
                  <Ionicons name="arrow-back" size={22} color="#4b5563" />
                </Pressable>
                <Text style={styles.readingHeaderTitle}>
                  {selectedArticle.category}
                </Text>
                <View style={{ width: 40 }} />
              </View>

              {/* Modal Contents */}
              <ScrollView style={{ flex: 1, padding: 24 }}>
                <Text style={styles.articleMainTitle}>
                  {selectedArticle.title}
                </Text>
                
                {/* Author Info */}
                <View style={styles.authorRow}>
                  <View style={styles.authorAvatar}>
                    <Ionicons name="newspaper-outline" size={16} color="#15803d" />
                  </View>
                  <View>
                    <Text style={styles.authorName}>{selectedArticle.source}</Text>
                    <Text style={styles.authorMeta}>
                      Published {selectedArticle.time} • {selectedArticle.readTime}
                    </Text>
                  </View>
                </View>

                {/* Article Body */}
                <View style={styles.articleBody}>
                  {selectedArticle.paragraphs.map((p, idx) => (
                    <Text key={idx} style={styles.bodyParagraph}>
                      {p}
                    </Text>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0f172a",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 3,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 2,
  },

  /* Featured Card */
  featuredCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 24,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
  },
  featuredMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  timeText: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "600",
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: 12,
    lineHeight: 24,
  },
  featuredSummary: {
    fontSize: 13,
    color: "#475569",
    marginTop: 8,
    lineHeight: 18,
    fontWeight: "500",
  },
  readMoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 4,
  },
  readMoreText: {
    color: "#15803d",
    fontSize: 12,
    fontWeight: "800",
  },

  /* List View */
  listContainer: {
    gap: 12,
  },
  articleCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: 10,
    lineHeight: 20,
  },
  articleSummary: {
    fontSize: 12,
    color: "#475569",
    marginTop: 6,
    lineHeight: 17,
  },
  articleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 10,
  },
  articleSource: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "700",
  },

  /* Reading view modal */
  readingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    backgroundColor: "#ffffff",
  },
  readingBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  readingHeaderTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  articleMainTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
    lineHeight: 28,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f1f5f9",
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  authorName: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0f172a",
  },
  authorMeta: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "500",
    marginTop: 1,
  },
  articleBody: {
    paddingBottom: 40,
  },
  bodyParagraph: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: "500",
  },
});

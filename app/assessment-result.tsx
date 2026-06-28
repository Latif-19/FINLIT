import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { Pressable, SafeAreaView, Text, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../store/useUserStore";

interface Module {
  title: string;
  desc: string;
  duration: string;
  icon: string;
  color: string;
}

const getPersonalizedSyllabus = (score: number, goal: string, tierColor: string): Module[] => {
  const level = score <= 8 ? "Beginner" : score <= 12 ? "Intermediate" : "Advanced";
  
  if (level === "Beginner") {
    switch (goal) {
      case "Build an Emergency Fund":
        return [
          {
            title: "MoMo Savings & Vaults",
            desc: "Learn how to separate savings from spending money using MTN MoMo Vault or Telecel Cash.",
            duration: "8 mins",
            icon: "wallet-outline",
            color: tierColor,
          },
          {
            title: "The Emergency Buffer",
            desc: "Understand how building a GH₵ 1,000 starter safety net protects you from borrowing.",
            duration: "6 mins",
            icon: "shield-checkmark-outline",
            color: tierColor,
          },
          {
            title: "Budgeting Essentials (The 50/30/20 Rule)",
            desc: "Learn to split your allowance or salary between needs, wants, and savings, accounting for MoMo fees.",
            duration: "5 mins",
            icon: "cash-outline",
            color: tierColor,
          },
        ];
      case "Improve Budgeting":
        return [
          {
            title: "Budgeting Essentials (The 50/30/20 Rule)",
            desc: "Learn to split your monthly allowance/salary between needs, wants, and savings.",
            duration: "5 mins",
            icon: "wallet-outline",
            color: tierColor,
          },
          {
            title: "Managing MoMo Fees & E-levy",
            desc: "Identify transaction costs and E-levy fees that leak money, and learn how to minimize them.",
            duration: "6 mins",
            icon: "cash-outline",
            color: tierColor,
          },
          {
            title: "Expense Tracking 101",
            desc: "Simple ways to record and track cash and digital wallet expenditures regularly.",
            duration: "8 mins",
            icon: "analytics-outline",
            color: tierColor,
          },
        ];
      case "Learn Investing":
        return [
          {
            title: "Savings Foundations",
            desc: "Understand why establishing a savings buffer is necessary before making investments.",
            duration: "6 mins",
            icon: "cash-outline",
            color: tierColor,
          },
          {
            title: "Ghana Treasury Bills 101",
            desc: "An entry-level guide to buying 91-day and 182-day government Treasury Bills.",
            duration: "8 mins",
            icon: "shield-checkmark-outline",
            color: tierColor,
          },
          {
            title: "Power of Compounding Interest",
            desc: "See how starting early allows compounding interest to grow your savings in fixed deposits.",
            duration: "10 mins",
            icon: "stats-chart-outline",
            color: tierColor,
          },
        ];
      case "Become Debt Free":
        return [
          {
            title: "Avoiding Digital Loan Traps",
            desc: "Learn why high-interest mobile apps (Qwikloan, Fido) can be dangerous and how to avoid debt traps.",
            duration: "6 mins",
            icon: "trending-down-outline",
            color: tierColor,
          },
          {
            title: "Budgeting Essentials (The 50/30/20 Rule)",
            desc: "Free up money in your monthly budget to pay off outstanding mobile money debts first.",
            duration: "5 mins",
            icon: "wallet-outline",
            color: tierColor,
          },
          {
            title: "Starter Emergency Buffer",
            desc: "Build a small emergency reserve to avoid taking out new mobile loans during urgent situations.",
            duration: "8 mins",
            icon: "shield-checkmark-outline",
            color: tierColor,
          },
        ];
      case "Start a Business":
        return [
          {
            title: "Student Side-Hustles 101",
            desc: "Explore business ideation, managing startup costs, and cash flow on a student budget.",
            duration: "15 mins",
            icon: "briefcase-outline",
            color: tierColor,
          },
          {
            title: "Personal Budgeting Basics",
            desc: "Ensure your personal finances are stable before launching a campus business.",
            duration: "5 mins",
            icon: "wallet-outline",
            color: tierColor,
          },
          {
            title: "MoMo for Small Businesses",
            desc: "Setting up MoMo merchant wallets and accepting payments from customers.",
            duration: "6 mins",
            icon: "cash-outline",
            color: tierColor,
          },
        ];
      case "Save for Education":
        return [
          {
            title: "Student Budgeting & Allowance",
            desc: "Learn how to manage your monthly semester allowance and hostel expenses.",
            duration: "9 mins",
            icon: "school-outline",
            color: tierColor,
          },
          {
            title: "Saving for Hostel & Fees",
            desc: "Start consistent savings habits to cover university fees and accommodation costs.",
            duration: "6 mins",
            icon: "cash-outline",
            color: tierColor,
          },
          {
            title: "Student Loans & Bursaries in Ghana",
            desc: "Learn how the Student Loan Trust Fund (SLTF) works, alongside local KNUST and GETFund bursaries.",
            duration: "7 mins",
            icon: "book-outline",
            color: tierColor,
          },
        ];
      default:
        return [
          {
            title: "Budgeting Essentials (The 50/30/20 Rule)",
            desc: "Learn to split your monthly allowance/salary between needs, wants, and savings.",
            duration: "5 mins",
            icon: "wallet-outline",
            color: tierColor,
          },
          {
            title: "MoMo Savings & Vaults",
            desc: "Learn how to separate savings from spending money using MTN MoMo Vault or Telecel Cash.",
            duration: "8 mins",
            icon: "shield-checkmark-outline",
            color: tierColor,
          },
          {
            title: "The Emergency Buffer",
            desc: "Understand how building a GH₵ 1,000 starter safety net protects you from borrowing.",
            duration: "6 mins",
            icon: "cash-outline",
            color: tierColor,
          },
        ];
    }
  } else if (level === "Intermediate") {
    switch (goal) {
      case "Build an Emergency Fund":
        return [
          {
            title: "Inflation & Cash Depreciation",
            desc: "Understand why keeping cash idle loses buying power in Ghana and how to protect it.",
            duration: "8 mins",
            icon: "shield-checkmark-outline",
            color: tierColor,
          },
          {
            title: "High-Yield MoMo & Bank Savings",
            desc: "Compare interest-earning mobile wallets and local high-yield savings plans.",
            duration: "6 mins",
            icon: "cash-outline",
            color: tierColor,
          },
          {
            title: "Automating Savings & Bills",
            desc: "Set up auto-save platforms to build a 3-month living expense buffer effortlessly.",
            duration: "7 mins",
            icon: "flash-outline",
            color: tierColor,
          },
        ];
      case "Improve Budgeting":
        return [
          {
            title: "Automating Savings & Bills",
            desc: "Route cash to your savings wallet automatically on paycheck or allowance day.",
            duration: "7 mins",
            icon: "flash-outline",
            color: tierColor,
          },
          {
            title: "Budgeting Apps & Tools",
            desc: "How to use local finance apps and spreadsheets to track expenses and MoMo transaction fees.",
            duration: "9 mins",
            icon: "analytics-outline",
            color: tierColor,
          },
          {
            title: "Inflation-Proof Budgeting",
            desc: "Adjusting your budgeting plan to maintain saving power despite rising costs of goods in Ghana.",
            duration: "10 mins",
            icon: "trending-up-outline",
            color: tierColor,
          },
        ];
      case "Learn Investing":
        return [
          {
            title: "Ghana Treasury Bills",
            desc: "How to buy government T-Bills directly via mobile banking or local broker apps.",
            duration: "10 mins",
            icon: "trending-up-outline",
            color: tierColor,
          },
          {
            title: "Local Mutual Funds 101",
            desc: "Learn about money market mutual funds like Databank Mfund, Enterprise, or EDC.",
            duration: "6 mins",
            icon: "cash-outline",
            color: tierColor,
          },
          {
            title: "Introduction to local Stocks (GSE)",
            desc: "An introduction to buying shares on the Ghana Stock Exchange and understanding risk.",
            duration: "12 mins",
            icon: "stats-chart-outline",
            color: tierColor,
          },
        ];
      case "Become Debt Free":
        return [
          {
            title: "Mobile Loan Payoff Strategies",
            desc: "Compare the Avalanche and Snowball methods to eliminate mobile loan and bank debts.",
            duration: "6 mins",
            icon: "trending-down-outline",
            color: tierColor,
          },
          {
            title: "Cost of Credit & Interest Rates",
            desc: "Understand how interest rates and late fees are calculated on mobile money loans.",
            duration: "8 mins",
            icon: "card-outline",
            color: tierColor,
          },
          {
            title: "Automating Loan Payments",
            desc: "Set up auto-debit payments or payment reminders to avoid high late fees on digital loans.",
            duration: "7 mins",
            icon: "flash-outline",
            color: tierColor,
          },
        ];
      case "Start a Business":
        return [
          {
            title: "Business Account Essentials",
            desc: "Separate your personal finances from your side-hustle using merchant MoMo accounts.",
            duration: "15 mins",
            icon: "briefcase-outline",
            color: tierColor,
          },
          {
            title: "Cash Flow & Profit Management",
            desc: "Track business revenue, expense costs, and net profit margins in your side hustle.",
            duration: "8 mins",
            icon: "business-outline",
            color: tierColor,
          },
          {
            title: "Local Payment Gateways",
            desc: "Learn to integrate Paystack, Hubtel, or MoMo APIs to accept online customer payments.",
            duration: "7 mins",
            icon: "flash-outline",
            color: tierColor,
          },
        ];
      case "Save for Education":
        return [
          {
            title: "Education Saving Plans",
            desc: "Leverage money market mutual funds to compound savings for hostel and school fees.",
            duration: "9 mins",
            icon: "school-outline",
            color: tierColor,
          },
          {
            title: "Inflation vs Education Costs",
            desc: "Learn how tuition inflation increases, and how to select investments to match future costs.",
            duration: "10 mins",
            icon: "trending-up-outline",
            color: tierColor,
          },
          {
            title: "SLTF & Financial Aid Application",
            desc: "Detailed walkthrough of applying for the Student Loan Trust Fund and local bursaries.",
            duration: "6 mins",
            icon: "cash-outline",
            color: tierColor,
          },
        ];
      default:
        return [
          {
            title: "Automating Savings & Bills",
            desc: "Set up auto-save platforms to build a 3-month living expense buffer effortlessly.",
            duration: "7 mins",
            icon: "flash-outline",
            color: tierColor,
          },
          {
            title: "Ghana Treasury Bills",
            desc: "How to buy government T-Bills directly via mobile banking or local broker apps.",
            duration: "10 mins",
            icon: "trending-up-outline",
            color: tierColor,
          },
          {
            title: "Local Mutual Funds 101",
            desc: "Learn about money market mutual funds like Databank Mfund, Enterprise, or EDC.",
            duration: "6 mins",
            icon: "cash-outline",
            color: tierColor,
          },
        ];
    }
  } else {
    // Advanced
    switch (goal) {
      case "Build an Emergency Fund":
        return [
          {
            title: "Emergency Fund Capital Allocation",
            desc: "Optimize where emergency reserves sit across Treasury Bills, fixed deposits, and mutual funds.",
            duration: "10 mins",
            icon: "shield-checkmark-outline",
            color: tierColor,
          },
          {
            title: "Hedging Against inflation & Depreciation",
            desc: "Analyze how Cedi exchange rate depreciation affects your savings and how to hedge it.",
            duration: "10 mins",
            icon: "analytics-outline",
            color: tierColor,
          },
          {
            title: "Liquidity vs. Yield in Ghana",
            desc: "Balance immediate accessibility with interest yields in money market mutual funds.",
            duration: "9 mins",
            icon: "ribbon-outline",
            color: tierColor,
          },
        ];
      case "Improve Budgeting":
        return [
          {
            title: "Cash Flow & Capital Allocation",
            desc: "Align your monthly budget with strategic investment contributions and capital goals.",
            duration: "12 mins",
            icon: "analytics-outline",
            color: tierColor,
          },
          {
            title: "Tax Planning in Ghana",
            desc: "Understand direct/indirect taxes, GRA tax structures, and how to optimize personal tax liabilities.",
            duration: "9 mins",
            icon: "ribbon-outline",
            color: tierColor,
          },
          {
            title: "Advanced Wealth Allocation",
            desc: "Set up voluntary Tier-3 provident funds and personal pension schemes for tax relief.",
            duration: "7 mins",
            icon: "flash-outline",
            color: tierColor,
          },
        ];
      case "Learn Investing":
        return [
          {
            title: "GSE Equities & Brokerage Accounts",
            desc: "Advanced strategies for trading stocks on the Ghana Stock Exchange and choosing brokerages.",
            duration: "12 mins",
            icon: "stats-chart-outline",
            color: tierColor,
          },
          {
            title: "Evaluating Mutual Funds in Ghana",
            desc: "Analyze fund performance, management expense ratios, and asset portfolios of local funds.",
            duration: "9 mins",
            icon: "ribbon-outline",
            color: tierColor,
          },
          {
            title: "Forex & Off-shore Investing Channels",
            desc: "Understand legal channels, risk, and portfolio diversification with foreign currency assets.",
            duration: "10 mins",
            icon: "analytics-outline",
            color: tierColor,
          },
        ];
      case "Become Debt Free":
        return [
          {
            title: "Debt Restructuring & Consolidation",
            desc: "Learn how to consolidate high-interest mobile loans into a single lower-cost commercial bank loan.",
            duration: "9 mins",
            icon: "trending-down-outline",
            color: tierColor,
          },
          {
            title: "Leveraging Debt Strategically",
            desc: "Good debt vs. bad debt: using business loans or T-bill collateralized financing effectively.",
            duration: "8 mins",
            icon: "card-outline",
            color: tierColor,
          },
          {
            title: "Interest Cost Minimization",
            desc: "Mathematical modeling to minimize total interest paid on long-term loans and mortgages.",
            duration: "10 mins",
            icon: "trending-up-outline",
            color: tierColor,
          },
        ];
      case "Start a Business":
        return [
          {
            title: "Side Hustle Scaling & Registration",
            desc: "How to register a Sole Proprietorship or Limited Liability Company at the Registrar General's Department.",
            duration: "15 mins",
            icon: "briefcase-outline",
            color: tierColor,
          },
          {
            title: "GRA Tax Compliance for SMEs",
            desc: "Understanding VAT, withholding taxes, income taxes, and filing returns in Ghana.",
            duration: "10 mins",
            icon: "business-outline",
            color: tierColor,
          },
          {
            title: "Raising Capital in Ghana",
            desc: "Compare angel funding, partner capital, bank financing, and crowd-funding in the local ecosystem.",
            duration: "12 mins",
            icon: "ribbon-outline",
            color: tierColor,
          },
        ];
      case "Save for Education":
        return [
          {
            title: "Local Education Insurance Policies",
            desc: "Evaluate commercial education insurance policies vs self-directed mutual fund savings.",
            duration: "11 mins",
            icon: "school-outline",
            color: tierColor,
          },
          {
            title: "Foreign Post-Grad Planning",
            desc: "Financial planning for foreign studies, including blocked accounts, proof of funds, and scholarships.",
            duration: "9 mins",
            icon: "ribbon-outline",
            color: tierColor,
          },
          {
            title: "High-Yield Education Portfolios",
            desc: "Structure a low-risk, compounding portfolio to match your university fee schedule.",
            duration: "10 mins",
            icon: "book-outline",
            color: tierColor,
          },
        ];
      default:
        return [
          {
            title: "GSE Equities & Brokerage Accounts",
            desc: "Advanced strategies for trading stocks on the Ghana Stock Exchange and choosing brokerages.",
            duration: "12 mins",
            icon: "stats-chart-outline",
            color: tierColor,
          },
          {
            title: "Evaluating Mutual Funds in Ghana",
            desc: "Analyze fund performance, management expense ratios, and asset portfolios of local funds.",
            duration: "9 mins",
            icon: "ribbon-outline",
            color: tierColor,
          },
          {
            title: "Forex & Off-shore Investing Channels",
            desc: "Understand legal channels, risk, and portfolio diversification with foreign currency assets.",
            duration: "10 mins",
            icon: "analytics-outline",
            color: tierColor,
          },
        ];
    }
  }
};

export default function AssessmentResultScreen() {
  const params = useLocalSearchParams();
  const score = parseInt((params.score as string) || "5", 10);
  const goal = (params.goal as string) || "";
  const userName = useUserStore((s) => s.name);

  useEffect(() => {
    // Automatically sync the score and goal to useUserStore
    const store = useUserStore.getState();
    store.setScore(score);
    if (goal) {
      store.setGoal(goal);
    }
  }, [score, goal]);

  // Determine financial tier configuration
  let tier = "Financial Novice";
  let tierColor = "#b45309"; // amber-700
  let tierTextClass = "text-amber-800";
  let badgeIcon = "school";

  if (score > 8 && score <= 12) {
    tier = "Smart Money Manager";
    tierColor = "#15803d"; // green-700
    tierTextClass = "text-green-800";
    badgeIcon = "ribbon";
  } else if (score > 12) {
    tier = "Wealth Builder Pro";
    tierColor = "#1d4ed8"; // blue-700
    tierTextClass = "text-blue-800";
    badgeIcon = "trophy";
  }

  const goalDesc = goal ? ` to help you achieve your goal to "${goal.toLowerCase()}"` : "";
  let description = `Hi ${userName.split(" ")[0]}, you are just starting your financial journey! We have created a curated path${goalDesc} and master basic budgeting and saving habits.`;

  if (score > 8 && score <= 12) {
    description = `Excellent work, ${userName.split(" ")[0]}! You have a solid grasp on saving and general financial principles. We have tailored modules${goalDesc} for automation and compounding growth.`;
  } else if (score > 12) {
    description = `Incredible performance, ${userName.split(" ")[0]}! You demonstrate advanced financial concepts. Your curated lessons are optimized${goalDesc} for market investments and asset growth.`;
  }

  // Get personalized syllabus based on combined score + goal
  const syllabus = getPersonalizedSyllabus(score, goal, tierColor);

  // Calculate score ratings
  const budgetingGrade = score >= 11 ? "Advanced" : score >= 7 ? "Intermediate" : "Beginner";
  const savingsGrade = score >= 13 ? "Consistent" : score >= 8 ? "Moderate" : "Starting Out";
  const investingGrade = score >= 12 ? "Knowledgeable" : score >= 6 ? "Interested" : "Uninitiated";

  // Simple rules for recommendation list
  let recommendations = ["Budgeting Basics", "Saving Fundamentals", "Emergency Funds"];

  if (goal === "Build an Emergency Fund") {
    recommendations = ["Emergency Funds Blueprint", "Saving Fundamentals", "Budgeting Basics"];
  } else if (goal === "Improve Budgeting") {
    recommendations = ["Budgeting Basics", "Saving Fundamentals", "Automating Savings & Bills"];
  } else if (goal === "Learn Investing") {
    recommendations = ["Investing Essentials", "Compounding Interest Explained", "Stock Market Index Funds 101"];
  } else if (goal === "Become Debt Free") {
    recommendations = ["Debt Payoff Strategies", "Budgeting Basics", "Saving Fundamentals"];
  } else if (goal === "Start a Business") {
    recommendations = ["Entrepreneurial Finance 101", "Startup Costs & Cash Flow", "Business Account Essentials"];
  } else if (goal === "Save for Education") {
    recommendations = ["Tax-Advantaged Education Savings", "529 Plans & Student Aid", "Student Budgeting Basics"];
  } else {
    // Score based default recommendations
    if (score > 12) {
      recommendations = ["Stock Market Index Funds & ETFs 101", "Tax-Advantaged Growth: IRAs & 401(k)s", "Dollar-Cost Averaging & Risk"];
    } else if (score > 8) {
      recommendations = ["Automating Savings & Bills", "Compounding Interest Explained", "High-Yield Saving & Inflation"];
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Decorative Accent Background */}
      <View className="absolute top-0 left-0 right-0 h-64 bg-green-800/10 rounded-b-[100px] -z-10" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 40 }}
        className="px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Branding header */}
        <View className="items-center mt-6">
          <View className="w-16 h-16 bg-white rounded-2xl items-center justify-center shadow-sm border border-gray-100 overflow-hidden">
            <Ionicons name="analytics" size={32} color="#15803d" />
          </View>
          <Text className="text-3xl font-extrabold text-green-950 mt-4 tracking-tight">
            Analysis Complete
          </Text>
          <Text className="text-gray-500 text-sm mt-1 text-center px-4 leading-5">
            Your customized dashboard and learning curriculum have been successfully curated!
          </Text>
        </View>

        {/* Tier Score Summary Card */}
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mt-6">
          <View className="items-center">
            {/* Visual radial indicator */}
            <View
              className={`w-20 h-20 rounded-full items-center justify-center border-4 border-white shadow-sm`}
              style={{ backgroundColor: tierColor + "15", borderColor: tierColor }}
            >
              <Ionicons name={badgeIcon as any} size={36} color={tierColor} />
            </View>

            <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-4">
              Your Financial Level
            </Text>
            <Text className={`text-2xl font-extrabold text-center mt-1 ${tierTextClass}`}>
              {tier}
            </Text>

            <View className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 mt-4 w-full">
              <Text className="text-gray-600 text-sm text-center leading-6 font-medium">
                {description}
              </Text>
            </View>
          </View>

          {/* Skill Breakdown */}
          <View className="border-t border-gray-100 pt-5 mt-5">
            <Text className="text-gray-800 font-bold text-sm mb-3">Syllabus Breakdown</Text>
            
            <View className="space-y-3.5">
              <View className="flex-row justify-between items-center mt-2.5">
                <Text className="text-gray-500 text-sm">Budgeting & Expense Control</Text>
                <Text className="text-green-700 text-sm font-bold">{budgetingGrade}</Text>
              </View>
              <View className="flex-row justify-between items-center mt-2.5">
                <Text className="text-gray-500 text-sm">Savings Automation Rate</Text>
                <Text className="text-green-700 text-sm font-bold">{savingsGrade}</Text>
              </View>
              <View className="flex-row justify-between items-center mt-2.5">
                <Text className="text-gray-500 text-sm">Investment Strategy & Compounding</Text>
                <Text className="text-green-700 text-sm font-bold">{investingGrade}</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between border-t border-gray-100 w-full pt-4 mt-4">
              <Text className="text-gray-500 font-semibold text-sm">Overall Diagnostic Score:</Text>
              <View className="bg-green-50 px-3.5 py-1 rounded-full border border-green-200">
                <Text className="text-green-800 font-bold text-sm">{score} / 15</Text>
              </View>
            </View>
          </View>
        </View>

        {/* YOUR FINANCIAL PROFILE */}
        <View className="mt-8">
          <Text className="text-xl font-bold text-gray-800 mb-4 px-1 uppercase tracking-tight">
            📋 Your Financial Profile
          </Text>

          <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <View className="flex-row flex-wrap -mx-2">
              {/* Financial Knowledge */}
              <View className="w-1/2 px-2 mb-4 text-left">
                <View className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex-1">
                  <Ionicons name="school-outline" size={20} color={tierColor} />
                  <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-2">
                    Financial Knowledge
                  </Text>
                  <Text className="text-sm font-extrabold text-gray-800 mt-1">
                    {score <= 8 ? "Beginner" : score <= 12 ? "Intermediate" : "Advanced"}
                  </Text>
                </View>
              </View>

              {/* Primary Goal */}
              <View className="w-1/2 px-2 mb-4 text-left">
                <View className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex-1">
                  <Ionicons name="flag-outline" size={20} color={tierColor} />
                  <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-2">
                    Primary Goal
                  </Text>
                  <Text className="text-sm font-extrabold text-gray-800 mt-1" numberOfLines={1}>
                    {goal || "General Literacy"}
                  </Text>
                </View>
              </View>

              {/* Recommended Learning Style */}
              <View className="w-1/2 px-2 text-left">
                <View className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex-1">
                  <Ionicons name="book-outline" size={20} color={tierColor} />
                  <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-2">
                    Learning Style
                  </Text>
                  <Text className="text-sm font-extrabold text-gray-800 mt-1">
                    Interactive Lessons
                  </Text>
                </View>
              </View>

              {/* Estimated Learning Journey */}
              <View className="w-1/2 px-2 text-left">
                <View className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex-1">
                  <Ionicons name="calendar-outline" size={20} color={tierColor} />
                  <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-2">
                    Learning Journey
                  </Text>
                  <Text className="text-sm font-extrabold text-gray-800 mt-1">
                    {score <= 8 ? "6 Weeks" : score <= 12 ? "4 Weeks" : "3 Weeks"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 🤖 FinLit AI Recommendation */}
        <View className="mt-8">
          <Text className="text-xl font-bold text-gray-800 mb-4 px-1 uppercase tracking-tight">
            🤖 FinLit AI Recommendation
          </Text>

          <View className="bg-green-50 border border-green-200/60 rounded-3xl p-5 shadow-sm">
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 rounded-full bg-green-700/10 items-center justify-center mr-3">
                <Text className="text-xl">🤖</Text>
              </View>
              <Text className="text-green-800 font-extrabold text-base">FinLit AI Tutor</Text>
            </View>

            <Text className="text-gray-700 text-sm font-semibold mb-3 leading-5">
              Based on your assessment,{"\n"}I recommend starting with:
            </Text>

            <View className="space-y-2 mb-2">
              {recommendations.map((rec, index) => (
                <View key={index} className="flex-row items-center mt-1">
                  <View className="w-2 h-2 rounded-full bg-green-700 mr-2.5" />
                  <Text className="text-gray-800 font-bold text-sm">{rec}</Text>
                </View>
              ))}
            </View>

            <View className="border-t border-green-200/40 pt-3 mt-3">
              <Text className="text-green-700 text-xs italic">
                {"* Later this will come from AI. For now it's generated using simple rules."}
              </Text>
            </View>
          </View>
        </View>

        {/* Learning Path Syllabus */}
        <View className="mt-8">
          <Text className="text-xl font-bold text-gray-800 mb-4 px-1">
            🎯 Your Personalized Syllabus
          </Text>

          {syllabus.map((item, index) => (
            <View
              key={index}
              className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-sm flex-row items-center mb-4"
            >
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: tierColor + "12" }}
              >
                <Ionicons name={item.icon as any} size={24} color={tierColor} />
              </View>

              <View className="flex-1 pr-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    MODULE {index + 1}
                  </Text>
                  <View className="bg-gray-100 px-2 py-0.5 rounded-full">
                    <Text className="text-gray-500 text-[10px] font-semibold">
                      {item.duration}
                    </Text>
                  </View>
                </View>
                <Text className="text-base font-bold text-gray-800 mt-1 leading-5">
                  {item.title}
                </Text>
                <Text className="text-gray-500 text-xs mt-1 leading-4">
                  {item.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Dashboard Curation Info */}
        <View className="bg-blue-50 border border-blue-100 p-4.5 rounded-2xl flex-row items-start mt-4">
          <Ionicons name="color-wand-outline" size={22} color="#1d4ed8" style={{ marginRight: 12, marginTop: 2 }} />
          <View className="flex-1">
            <Text className="text-blue-900 font-bold text-sm">Your Dashboard Is Ready</Text>
            <Text className="text-blue-700 text-xs mt-1 leading-4">
              {"We've personalized your dashboard with lessons, goals, recommendations, news, and financial insights based on your assessment."}
            </Text>
          </View>
        </View>

        {/* Dashboard Button */}
        <Pressable
          onPress={() => router.replace({
            pathname: "/(tabs)/home",
            params: {
              score: score.toString(),
              goal: goal,
            },
          } as any)}
          style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.95 : 1,
          })}
          className="bg-green-700 py-4 rounded-xl mt-8 shadow-md active:bg-green-800 flex-row justify-center items-center"
        >
          <Text className="text-white text-center font-bold text-base mr-2">
            Continue to Dashboard
          </Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

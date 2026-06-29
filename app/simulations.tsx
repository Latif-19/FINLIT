import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../store/useUserStore";
import "@/types/navigation";

type SimulationTab = "momo" | "tbill" | "loan" | "tax" | "inflation" | "stock";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: string;
  isUp: boolean;
}

import { MOCK_STOCKS } from "@/data/simulations";

const STOCKS = MOCK_STOCKS;

export default function SimulationsScreen() {
  const [activeTab, setActiveTab] = useState<SimulationTab>("momo");
  const isPremium = useUserStore((s) => s.isPremium);

  // 1. MoMo vs Bank Fee Calculator States
  const [momoAmount, setMomoAmount] = useState("200");
  const [momoType, setMomoType] = useState<"momo" | "cashout" | "bank">("momo");

  // 2. Ghana Treasury Bill Simulator States
  const [tbillAmount, setTbillAmount] = useState("1000");
  const [tbillTenure, setTbillTenure] = useState<91 | 182 | 364>(91);

  // 3. Qwikloan Interest Simulator States
  const [loanAmount, setLoanAmount] = useState("300");
  const [loanDuration, setLoanDuration] = useState<1 | 2 | 3>(1); // months

  // 4. Ghana Tax & Pension Planner States
  const [salaryInput, setSalaryInput] = useState("3500");

  // 5. Inflation Eroder States
  const [inflationPrincipal, setInflationPrincipal] = useState("5000");
  const [inflationRate, setInflationRate] = useState("22");
  const [inflationYears, setInflationYears] = useState<number>(3);

  // 6. Stock Market Sandbox States
  const [mockBalance, setMockBalance] = useState(10000);
  const [selectedStock, setSelectedStock] = useState<string>("MTNGH");
  const [buyAmount, setBuyAmount] = useState("1000");
  const [ownedShares, setOwnedShares] = useState<Record<string, number>>({
    MTNGH: 0,
    GCB: 0,
    ETI: 0,
  });
  const [stockFeedback, setStockFeedback] = useState<string | null>(null);

  // --- Calculations ---

  // MoMo calculations
  const calculateMomo = () => {
    const amt = parseFloat(momoAmount) || 0;
    if (amt <= 0) return { fee: 0, elevy: 0, totalCost: 0, totalDeducted: 0 };

    let fee = 0;
    let elevy = 0;

    if (momoType === "momo" || momoType === "bank") {
      if (amt > 100) {
        elevy = (amt - 100) * 0.01;
      }
    }

    if (momoType === "momo") {
      fee = Math.min(amt * 0.0075, 7.5);
    } else if (momoType === "cashout") {
      fee = Math.min(amt * 0.01, 10);
    } else if (momoType === "bank") {
      fee = 5;
    }

    const totalCost = fee + elevy;
    return {
      fee: parseFloat(fee.toFixed(2)),
      elevy: parseFloat(elevy.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      totalDeducted: parseFloat((amt + totalCost).toFixed(2)),
    };
  };

  // Treasury Bill calculations
  const calculateTbill = () => {
    const amt = parseFloat(tbillAmount) || 0;
    if (amt <= 0) return { interest: 0, finalAmount: 0, yieldRate: 0 };

    const rates = {
      91: 0.245,  
      182: 0.262, 
      364: 0.285, 
    };

    const yieldRate = rates[tbillTenure];
    const fractionOfYear = tbillTenure / 365;
    const interest = amt * yieldRate * fractionOfYear;

    return {
      interest: parseFloat(interest.toFixed(2)),
      finalAmount: parseFloat((amt + interest).toFixed(2)),
      yieldRate: Math.round(yieldRate * 100),
    };
  };

  // Loan calculations
  const calculateLoan = () => {
    const amt = parseFloat(loanAmount) || 0;
    if (amt <= 0) return { qwikInterest: 0, qwikTotal: 0, bankInterest: 0, bankTotal: 0 };

    const qwikRate = 0.069;
    const qwikInterest = amt * qwikRate * loanDuration;
    const qwikTotal = amt + qwikInterest;

    const bankRate = 0.025;
    const bankInterest = amt * bankRate * loanDuration;
    const bankTotal = amt + bankInterest;

    return {
      qwikInterest: parseFloat(qwikInterest.toFixed(2)),
      qwikTotal: parseFloat(qwikTotal.toFixed(2)),
      bankInterest: parseFloat(bankInterest.toFixed(2)),
      bankTotal: parseFloat(bankTotal.toFixed(2)),
    };
  };

  // Tax calculations (Ghana GRA progressive PAYE structure)
  const calculateTax = () => {
    const gross = parseFloat(salaryInput) || 0;
    if (gross <= 0) return { ssnit: 0, taxable: 0, paye: 0, net: 0, employerSsnit: 0 };

    // SSNIT Employee Tier 2 (5.5% deduction from gross)
    const ssnit = gross * 0.055;
    const taxable = gross - ssnit;

    // Ghana progressive PAYE tax table
    let paye = 0;
    let remaining = taxable;

    const brackets = [
      { limit: 490, rate: 0.0 },
      { limit: 110, rate: 0.05 },
      { limit: 130, rate: 0.10 },
      { limit: 3170, rate: 0.175 },
      { limit: 11100, rate: 0.25 },
      { limit: Infinity, rate: 0.30 },
    ];

    for (const b of brackets) {
      if (remaining <= 0) break;
      const amountInBracket = Math.min(remaining, b.limit);
      paye += amountInBracket * b.rate;
      remaining -= amountInBracket;
    }

    const net = taxable - paye;
    const employerSsnit = gross * 0.13; // 13% employer contribution

    return {
      ssnit: parseFloat(ssnit.toFixed(2)),
      taxable: parseFloat(taxable.toFixed(2)),
      paye: parseFloat(paye.toFixed(2)),
      net: parseFloat(net.toFixed(2)),
      employerSsnit: parseFloat(employerSsnit.toFixed(2)),
    };
  };

  // Inflation erosion calculations
  const calculateInflation = () => {
    const principal = parseFloat(inflationPrincipal) || 0;
    const rate = (parseFloat(inflationRate) || 0) / 100;
    
    if (principal <= 0) return { erodedValue: 0, erodedLoss: 0, tbillValue: 0, realTbillPower: 0 };

    // Erosion of holding cash: PV = FV / (1 + r)^n
    const erodedValue = principal / Math.pow(1 + rate, inflationYears);
    const erodedLoss = principal - erodedValue;

    // Hedging with T-bills compounding at average ~26% annually
    const tbillValue = principal * Math.pow(1 + 0.26, inflationYears);
    const realTbillPower = tbillValue / Math.pow(1 + rate, inflationYears);

    return {
      erodedValue: parseFloat(erodedValue.toFixed(2)),
      erodedLoss: parseFloat(erodedLoss.toFixed(2)),
      tbillValue: parseFloat(tbillValue.toFixed(2)),
      realTbillPower: parseFloat(realTbillPower.toFixed(2)),
    };
  };

  // Stock Paper Trading actions
  const handleBuyStock = () => {
    const amt = parseFloat(buyAmount) || 0;
    if (amt <= 0) return;

    const stock = STOCKS.find((s) => s.symbol === selectedStock);
    if (!stock) return;

    if (amt > mockBalance) {
      setStockFeedback("❌ Insufficient mock portfolio balance.");
      return;
    }

    const sharesToBuy = Math.floor(amt / stock.price);
    if (sharesToBuy <= 0) {
      setStockFeedback("❌ Amount is too small to purchase a single share.");
      return;
    }

    const actualCost = sharesToBuy * stock.price;
    setMockBalance((prev) => parseFloat((prev - actualCost).toFixed(2)));
    setOwnedShares((prev) => ({
      ...prev,
      [selectedStock]: prev[selectedStock] + sharesToBuy,
    }));
    
    setStockFeedback(`✅ Successfully bought ${sharesToBuy} shares of ${selectedStock}!`);
    setTimeout(() => setStockFeedback(null), 3000);
  };

  const momoResults = calculateMomo();
  const tbillResults = calculateTbill();
  const loanResults = calculateLoan();
  const taxResults = calculateTax();
  const inflationResults = calculateInflation();

  const renderPremiumLock = (title: string, desc: string) => (
    <View className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md items-center mt-6 text-center">
      <View className="w-16 h-16 bg-amber-50 rounded-full items-center justify-center mb-4">
        <Ionicons name="lock-closed" size={32} color="#d97706" />
      </View>
      <Text className="text-xl font-bold text-gray-800 text-center">{title}</Text>
      <View className="bg-amber-100 px-3 py-1 rounded-full border border-amber-200 mt-2">
        <Text className="text-amber-800 text-[10px] font-black uppercase tracking-wider">
          Premium Feature
        </Text>
      </View>
      <Text className="text-gray-500 text-sm text-center mt-3 leading-5 px-4">{desc}</Text>
      <Pressable
        onPress={() => router.push("/paywall")}
        className="bg-green-700 py-3.5 px-8 rounded-2xl mt-6 shadow-md active:bg-green-800"
      >
        <Text className="text-white font-extrabold text-sm uppercase tracking-wider">
          Upgrade to Premium
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-6 pt-12 pb-4 bg-white border-b border-gray-200">
        <Pressable
          onPress={() => router.back()}
          className="p-2 bg-gray-50 rounded-full border border-gray-100 active:opacity-80"
        >
          <Ionicons name="arrow-back" size={20} color="#15803d" />
        </Pressable>
        <Text className="text-xl font-extrabold text-gray-800 ml-4 flex-1 text-center pr-8">
          Financial Simulators
        </Text>
      </View>

      {/* Dynamic horizontal scrollable tabs */}
      <View className="bg-white border-b border-gray-200">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
        >
          <Pressable
            onPress={() => setActiveTab("momo")}
            className={`px-4 py-2.5 rounded-full border flex-row items-center ${
              activeTab === "momo" ? "bg-green-700 border-green-700" : "bg-gray-50 border-gray-200"
            }`}
          >
            <Ionicons name="wallet-outline" size={14} color={activeTab === "momo" ? "white" : "#6b7280"} />
            <Text className={`text-xs font-bold ml-1.5 ${activeTab === "momo" ? "text-white" : "text-gray-600"}`}>
              MoMo Fees
            </Text>
          </Pressable>

          {["tbill", "loan", "tax", "inflation", "stock"].map((tab) => {
            const labelMap: Record<string, string> = {
              tbill: "T-Bill Yield",
              loan: "Loan Interest",
              tax: "Tax & Pension",
              inflation: "Inflation Eroder",
              stock: "Stock Sandbox",
            };
            const iconMap: Record<string, string> = {
              tbill: "trending-up-outline",
              loan: "cash-outline",
              tax: "calculator-outline",
              inflation: "stats-chart-outline",
              stock: "business-outline",
            };
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab as any)}
                className={`px-4 py-2.5 rounded-full border flex-row items-center ${
                  isActive ? "bg-green-700 border-green-700" : "bg-gray-50 border-gray-200"
                }`}
              >
                <Ionicons name={iconMap[tab] as any} size={14} color={isActive ? "white" : "#6b7280"} />
                <Text className={`text-xs font-bold ml-1.5 ${isActive ? "text-white" : "text-gray-600"}`}>
                  {labelMap[tab]}
                </Text>
                {!isPremium && (
                  <Ionicons name="lock-closed" size={10} color={isActive ? "white" : "#b45309"} style={{ marginLeft: 4 }} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="p-5" showsVerticalScrollIndicator={false}>
          
          {/* ── TAB 1: MOMO FEES ── */}
          {activeTab === "momo" && (
            <View className="space-y-4">
              <View className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Transaction Details</Text>
                
                <Text className="text-gray-600 font-bold text-xs mb-1">Enter Amount (GH₵)</Text>
                <TextInput
                  value={momoAmount}
                  onChangeText={setMomoAmount}
                  keyboardType="numeric"
                  className="border border-gray-200 rounded-xl p-3 text-base text-gray-800 bg-gray-50/50 mb-4 font-semibold focus:border-green-700"
                />

                <Text className="text-gray-600 font-bold text-xs mb-2">Transaction Type</Text>
                <View className="flex-row gap-2">
                  {[
                    { type: "momo", label: "Transfer to MoMo" },
                    { type: "cashout", label: "Cash Out" },
                    { type: "bank", label: "MoMo to Bank" },
                  ].map((item) => (
                    <Pressable
                      key={item.type}
                      onPress={() => setMomoType(item.type as any)}
                      className={`flex-1 p-3 rounded-xl border items-center justify-center ${
                        momoType === item.type ? "bg-green-50 border-green-700" : "bg-white border-gray-200"
                      }`}
                    >
                      <Text className={`text-[10px] font-bold text-center ${momoType === item.type ? "text-green-800" : "text-gray-600"}`}>
                        {item.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Fee Breakdown</Text>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-gray-500 text-sm">Principal Amount</Text>
                  <Text className="text-gray-800 font-bold text-sm">GH₵ {parseFloat(momoAmount) || 0}</Text>
                </View>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-gray-500 text-sm">Network Fee</Text>
                  <Text className="text-gray-800 font-bold text-sm">GH₵ {momoResults.fee}</Text>
                </View>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-gray-500 text-sm">E-Levy Charge (1%)</Text>
                  <Text className="text-gray-800 font-bold text-sm">GH₵ {momoResults.elevy}</Text>
                </View>
                <View className="border-t border-gray-100 pt-3 flex-row justify-between items-center mb-3">
                  <Text className="text-green-800 font-bold text-sm">Total Fees Paid</Text>
                  <Text className="text-green-800 font-extrabold text-sm">GH₵ {momoResults.totalCost}</Text>
                </View>
                <View className="border-t border-gray-200 pt-4 flex-row justify-between items-center">
                  <Text className="text-gray-800 font-black text-base">Total Cost Deducted</Text>
                  <Text className="text-gray-800 font-black text-lg">GH₵ {momoResults.totalDeducted}</Text>
                </View>
              </View>
            </View>
          )}

          {/* ── TAB 2: TREASURY BILL ── */}
          {activeTab === "tbill" && (
            <View>
              {!isPremium ? (
                renderPremiumLock("Ghana Treasury Bill Simulator", "Unlock advanced interactive yield estimators to project savings growth over standard 91, 182, and 364 days compound schedules.")
              ) : (
                <View className="space-y-4">
                  <View className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Investment Parameters</Text>
                    <Text className="text-gray-600 font-bold text-xs mb-1">Principal (GH₵)</Text>
                    <TextInput
                      value={tbillAmount}
                      onChangeText={setTbillAmount}
                      keyboardType="numeric"
                      className="border border-gray-200 rounded-xl p-3 text-base text-gray-800 bg-gray-50/50 mb-4 font-semibold focus:border-green-700"
                    />
                    <Text className="text-gray-600 font-bold text-xs mb-2">Select Tenure</Text>
                    <View className="flex-row gap-2">
                      {[91, 182, 364].map((days) => (
                        <Pressable
                          key={days}
                          onPress={() => setTbillTenure(days as any)}
                          className={`flex-1 p-3 rounded-xl border items-center justify-center ${
                            tbillTenure === days ? "bg-green-50 border-green-700" : "bg-white border-gray-200"
                          }`}
                        >
                          <Text className={`text-xs font-bold ${tbillTenure === days ? "text-green-800" : "text-gray-600"}`}>
                            {days} Days
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <View className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Projected Earnings</Text>
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-gray-500 text-sm">Annual Interest Rate</Text>
                      <Text className="text-green-700 font-bold text-sm">~{tbillResults.yieldRate}% p.a.</Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-gray-500 text-sm">Interest Earned</Text>
                      <Text className="text-green-800 font-black text-sm">+GH₵ {tbillResults.interest}</Text>
                    </View>
                    <View className="border-t border-gray-200 pt-4 flex-row justify-between items-center">
                      <Text className="text-gray-800 font-black text-base">Maturity Balance</Text>
                      <Text className="text-gray-800 font-black text-lg">GH₵ {tbillResults.finalAmount}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ── TAB 3: LOAN INTEREST ── */}
          {activeTab === "loan" && (
            <View>
              {!isPremium ? (
                renderPremiumLock("Loan Interest Simulator", "Compare the costs of high-interest mobile money loans (MTN Qwikloan at 6.9% monthly) against standard commercial bank personal loan rates.")
              ) : (
                <View className="space-y-4">
                  <View className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Borrowing Details</Text>
                    <Text className="text-gray-600 font-bold text-xs mb-1">Loan Amount (GH₵)</Text>
                    <TextInput
                      value={loanAmount}
                      onChangeText={setLoanAmount}
                      keyboardType="numeric"
                      className="border border-gray-200 rounded-xl p-3 text-base text-gray-800 bg-gray-50/50 mb-4 font-semibold focus:border-green-700"
                    />
                    <Text className="text-gray-600 font-bold text-xs mb-2">Loan Tenure (Months)</Text>
                    <View className="flex-row gap-2">
                      {[1, 2, 3].map((m) => (
                        <Pressable
                          key={m}
                          onPress={() => setLoanDuration(m as any)}
                          className={`flex-1 p-3 rounded-xl border items-center justify-center ${
                            loanDuration === m ? "bg-green-50 border-green-700" : "bg-white border-gray-200"
                          }`}
                        >
                          <Text className={`text-xs font-bold ${loanDuration === m ? "text-green-800" : "text-gray-600"}`}>
                            {m} {m === 1 ? "Month" : "Months"}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <View className="flex-row gap-4">
                    <View className="flex-1 bg-red-50 border border-red-100 rounded-3xl p-4">
                      <Text className="text-red-700 font-black text-[10px] uppercase">Qwikloan (Mobile)</Text>
                      <Text className="text-gray-500 text-[10px] mt-2">Interest Paid</Text>
                      <Text className="text-red-600 text-base font-extrabold">GH₵ {loanResults.qwikInterest}</Text>
                      <Text className="text-gray-500 text-[10px] mt-2">Total Owed</Text>
                      <Text className="text-red-800 text-lg font-black">GH₵ {loanResults.qwikTotal}</Text>
                    </View>

                    <View className="flex-1 bg-green-50 border border-green-100 rounded-3xl p-4">
                      <Text className="text-green-700 font-black text-[10px] uppercase">Bank Personal Loan</Text>
                      <Text className="text-gray-500 text-[10px] mt-2">Interest Paid</Text>
                      <Text className="text-green-600 text-base font-extrabold">GH₵ {loanResults.bankInterest}</Text>
                      <Text className="text-gray-500 text-[10px] mt-2">Total Owed</Text>
                      <Text className="text-green-800 text-lg font-black">GH₵ {loanResults.bankTotal}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ── TAB 4: TAX & PENSION PLANNER ── */}
          {activeTab === "tax" && (
            <View>
              {!isPremium ? (
                renderPremiumLock("Tax & Pension Planner", "Determine your exact take-home pay under Ghana Revenue Authority PAYE tax brackets and compute mandatory SSNIT Tier 1 & 2 pension contributions.")
              ) : (
                <View className="space-y-4">
                  <View className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Income Parameters</Text>
                    <Text className="text-gray-600 font-bold text-xs mb-1">Gross Monthly Salary (GH₵)</Text>
                    <TextInput
                      value={salaryInput}
                      onChangeText={setSalaryInput}
                      keyboardType="numeric"
                      className="border border-gray-200 rounded-xl p-3 text-base text-gray-800 bg-gray-50/50 mb-2 font-semibold focus:border-green-700"
                    />
                  </View>

                  <View className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Salary Audit Breakdown</Text>
                    
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-gray-500 text-sm font-semibold">Gross Monthly Salary</Text>
                      <Text className="text-gray-800 font-bold text-sm">GH₵ {parseFloat(salaryInput) || 0}</Text>
                    </View>
                    
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-gray-500 text-sm">SSNIT Deduction (Employee 5.5%)</Text>
                      <Text className="text-red-600 font-bold text-sm">-GH₵ {taxResults.ssnit}</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-gray-500 text-sm">Taxable Income</Text>
                      <Text className="text-gray-800 font-bold text-sm">GH₵ {taxResults.taxable}</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-gray-500 text-sm">GRA PAYE Income Tax</Text>
                      <Text className="text-red-600 font-bold text-sm">-GH₵ {taxResults.paye}</Text>
                    </View>

                    <View className="border-t border-gray-200 pt-4 flex-row justify-between items-center mb-3">
                      <Text className="text-gray-800 font-black text-base">Net Take-Home Pay</Text>
                      <Text className="text-green-800 font-black text-lg">GH₵ {taxResults.net}</Text>
                    </View>

                    <View className="border-t border-gray-100 pt-3 flex-row justify-between items-center">
                      <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">SSNIT Employer (Bonus 13%)</Text>
                      <Text className="text-blue-800 font-bold text-xs">+GH₵ {taxResults.employerSsnit}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ── TAB 5: INFLATION ERODER ── */}
          {activeTab === "inflation" && (
            <View>
              {!isPremium ? (
                renderPremiumLock("Inflation & Purchasing Power Eroder", "Visualize how local inflation (e.g. 20%+) erodes cash savings over years and examine how Government Treasury Bills act as a shield.")
              ) : (
                <View className="space-y-4">
                  <View className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Inflation parameters</Text>
                    
                    <Text className="text-gray-600 font-bold text-xs mb-1">Cash Principal (GH₵)</Text>
                    <TextInput
                      value={inflationPrincipal}
                      onChangeText={setInflationPrincipal}
                      keyboardType="numeric"
                      className="border border-gray-200 rounded-xl p-3 text-base text-gray-800 bg-gray-50/50 mb-3 font-semibold focus:border-green-700"
                    />

                    <Text className="text-gray-600 font-bold text-xs mb-1">Annual Inflation Rate (%)</Text>
                    <TextInput
                      value={inflationRate}
                      onChangeText={setInflationRate}
                      keyboardType="numeric"
                      className="border border-gray-200 rounded-xl p-3 text-base text-gray-800 bg-gray-50/50 mb-4 font-semibold focus:border-green-700"
                    />

                    <Text className="text-gray-600 font-bold text-xs mb-2">Time Horizon (Years)</Text>
                    <View className="flex-row gap-2">
                      {[1, 3, 5, 10].map((y) => (
                        <Pressable
                          key={y}
                          onPress={() => setInflationYears(y)}
                          className={`flex-1 p-2.5 rounded-xl border items-center justify-center ${
                            inflationYears === y ? "bg-green-50 border-green-700" : "bg-white border-gray-200"
                          }`}
                        >
                          <Text className={`text-xs font-bold ${inflationYears === y ? "text-green-800" : "text-gray-600"}`}>
                            {y} Yr{y > 1 ? "s" : ""}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Erosion Results */}
                  <View className="bg-red-50 border border-red-100 rounded-3xl p-5">
                    <Text className="text-red-800 font-bold text-xs uppercase tracking-wide">Holding Cash (Erosion Impact)</Text>
                    <Text className="text-gray-600 text-xs mt-1">{"If left under your mattress or in a basic pocket wallet:"}</Text>
                    <Text className="text-gray-400 text-[10px] mt-3 uppercase font-bold">Lost Purchasing Power</Text>
                    <Text className="text-red-600 text-xl font-black">-GH₵ {inflationResults.erodedLoss}</Text>
                    <Text className="text-gray-400 text-[10px] mt-2 uppercase font-bold">Real Value in {inflationYears} Yrs</Text>
                    <Text className="text-red-950 text-base font-bold">GH₵ {inflationResults.erodedValue}</Text>
                  </View>

                  <View className="bg-green-50 border border-green-100 rounded-3xl p-5">
                    <Text className="text-green-800 font-bold text-xs uppercase tracking-wide">Investing in T-Bills (Shielding Impact)</Text>
                    <Text className="text-gray-600 text-xs mt-1">If compounded yearly in 26% Government T-Bills:</Text>
                    <Text className="text-gray-400 text-[10px] mt-3 uppercase font-bold">Nominal Value in {inflationYears} Yrs</Text>
                    <Text className="text-green-600 text-xl font-black">GH₵ {inflationResults.tbillValue}</Text>
                    <Text className="text-gray-400 text-[10px] mt-2 uppercase font-bold">Adjusted Real Purchasing Power</Text>
                    <Text className="text-green-950 text-base font-bold">GH₵ {inflationResults.realTbillPower}</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* ── TAB 6: STOCK MARKET PAPER TRADER ── */}
          {activeTab === "stock" && (
            <View>
              {!isPremium ? (
                renderPremiumLock("Stock Sandbox Paper Trading", "Unlock a simulated trading portal on the Ghana Stock Exchange. Trade actual stocks like MTNGH or GCB using mock cash balances to learn asset building.")
              ) : (
                <View className="space-y-4">
                  {/* Balance Card */}
                  <View className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex-row justify-between items-center">
                    <View>
                      <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Mock Portfolio Balance</Text>
                      <Text className="text-gray-800 text-2xl font-black mt-1">GH₵ {mockBalance.toLocaleString()}</Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        setMockBalance(10000);
                        setOwnedShares({ MTNGH: 0, GCB: 0, ETI: 0 });
                      }}
                      className="bg-gray-100 px-3 py-2 rounded-xl border border-gray-200 active:bg-gray-200"
                    >
                      <Text className="text-[10px] font-bold text-gray-600 uppercase">Reset Wallet</Text>
                    </Pressable>
                  </View>

                  {/* Stock List selection */}
                  <View className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Available GSE Stocks</Text>
                    {STOCKS.map((s) => (
                      <Pressable
                        key={s.symbol}
                        onPress={() => setSelectedStock(s.symbol)}
                        className={`flex-row justify-between items-center p-3 rounded-2xl border mb-2 ${
                          selectedStock === s.symbol ? "bg-green-50 border-green-700" : "bg-gray-50 border-gray-100"
                        }`}
                      >
                        <View>
                          <Text className="font-extrabold text-gray-800 text-sm">{s.symbol}</Text>
                          <Text className="text-[10px] text-gray-400">{s.name}</Text>
                        </View>
                        <View className="items-end">
                          <Text className="font-bold text-gray-800 text-sm">GH₵ {s.price.toFixed(2)}</Text>
                          <Text className={`text-[10px] font-extrabold ${s.isUp ? "text-green-600" : "text-red-500"}`}>{s.change}</Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>

                  {/* Transaction Input */}
                  <View className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Buy Shares</Text>
                    {stockFeedback && <Text className="text-xs font-bold mb-3">{stockFeedback}</Text>}
                    <Text className="text-gray-600 font-bold text-xs mb-1">Enter Transaction Value (GH₵)</Text>
                    <TextInput
                      value={buyAmount}
                      onChangeText={setBuyAmount}
                      keyboardType="numeric"
                      className="border border-gray-200 rounded-xl p-3 text-base text-gray-800 bg-gray-50/50 mb-4 font-semibold focus:border-green-700"
                    />
                    <Pressable
                      onPress={handleBuyStock}
                      className="bg-green-700 py-3.5 rounded-2xl items-center shadow-md active:bg-green-800"
                    >
                      <Text className="text-white font-extrabold text-xs uppercase tracking-wider">Buy {selectedStock} Shares</Text>
                    </Pressable>
                  </View>

                  {/* Owned Portfolio */}
                  <View className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Your Holdings</Text>
                    {Object.values(ownedShares).every((v) => v === 0) ? (
                      <Text className="text-gray-400 text-xs italic text-center py-4">No shares owned yet.</Text>
                    ) : (
                      Object.entries(ownedShares).map(([sym, count]) => {
                        if (count === 0) return null;
                        const stock = STOCKS.find((s) => s.symbol === sym)!;
                        const val = count * stock.price;
                        return (
                          <View key={sym} className="flex-row justify-between items-center py-2.5 border-b border-gray-100">
                            <View>
                              <Text className="font-bold text-gray-800 text-sm">{sym}</Text>
                              <Text className="text-[10px] text-gray-400">{count} Shares</Text>
                            </View>
                            <Text className="font-extrabold text-gray-800 text-sm">GH₵ {val.toFixed(2)}</Text>
                          </View>
                        );
                      })
                    )}
                  </View>
                </View>
              )}
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

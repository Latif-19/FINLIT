import { router, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useUserStore } from "../store/useUserStore";
import { simulationService } from "../services/simulations";
import type { SimulationRecord } from "@/types/api";
import type { SimulationResult } from "../store/useUserStore";
import "@/types/navigation";

type SimulationTab = "momo" | "tbill" | "loan" | "tax" | "inflation";

// Maps a backend simulation record to the shape the history UI renders.
function mapSimulationRecords(records: SimulationRecord[]): SimulationResult[] {
  return records.map((r) => {
    const params: Record<string, string> = {};
    for (const [k, v] of Object.entries(r.parameters ?? {})) params[k] = String(v);
    const label = typeof r.result?.["label"] === "string" ? (r.result["label"] as string) : r.type;
    const summary = typeof r.result?.["summary"] === "string" ? (r.result["summary"] as string) : "";
    return { id: r.id, type: r.type, label, params, result: summary, savedAt: r.savedAt };
  });
}

export default function SimulationsScreen() {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<SimulationTab>("momo");
  const isPremium = useUserStore((s) => s.isPremium);

  // 1. MoMo vs Bank Fee Calculator States
  const [momoAmount, setMomoAmount] = useState("200");
  const [momoType, setMomoType] = useState<"momo" | "cashout" | "bank">("momo");
  const [momoOperator, setMomoOperator] = useState<"mtn" | "telecel">("mtn");

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
      if (momoOperator === "mtn") {
        fee = Math.min(amt * 0.0075, 7.5);
      } else {
        fee = 0; // Telecel Cash transfers are free of network fees
      }
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

  const momoResults = calculateMomo();
  const tbillResults = calculateTbill();
  const loanResults = calculateLoan();
  const taxResults = calculateTax();
  const inflationResults = calculateInflation();

  const simulationHistory = useUserStore((s) => s.simulationHistory);
  const saveSimulationResult = useUserStore((s) => s.saveSimulationResult);

  // Load saved simulations from the backend whenever the screen is focused.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      simulationService
        .getHistory()
        .then((res) => {
          if (active) useUserStore.getState().setSimulationHistory(mapSimulationRecords(res.data));
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }, [])
  );

  const handleSaveResult = async (
    type: string,
    label: string,
    params: Record<string, string>,
    result: string
  ) => {
    // Optimistic local save + badge for instant feedback.
    saveSimulationResult({ type, label, params, result });
    useUserStore.getState().unlockBadge("simulator-user");
    Alert.alert("Saved", "Simulation result saved to your profile.");

    // Persist to the backend (also unlocks the Explorer badge server-side),
    // then refresh the history list from the backend's truth.
    try {
      await simulationService.saveSimulation({
        type,
        parameters: params,
        result: { label, summary: result },
      });
      const res = await simulationService.getHistory();
      useUserStore.getState().setSimulationHistory(mapSimulationRecords(res.data));
    } catch {
      // Offline — the optimistic local save already applied.
    }
  };

  const renderPremiumLock = (title: string, desc: string) => (
    <View className="bg-brand-bg rounded-3xl p-8 border border-brand-border shadow-md items-center mt-6 text-center">
      <View className="w-16 h-16 bg-amber-50 rounded-full items-center justify-center mb-4">
        <Ionicons name="lock-closed" size={32} color={colors.gold} />
      </View>
      <Text className="text-xl font-inter-bold text-brand-dark text-center">{title}</Text>
      <View className="bg-amber-100 px-3 py-1 rounded-full border border-amber-200 mt-2">
        <Text className="text-amber-800 text-[10px] font-inter-bold uppercase tracking-wider">
          Premium Feature
        </Text>
      </View>
      <Text className="text-brand-gray text-sm text-center mt-3 leading-5 px-4">{desc}</Text>
      <Pressable
        onPress={() => router.push("/paywall")}
        className="bg-brand-emerald py-3.5 px-8 rounded-2xl mt-6 shadow-sm active:opacity-90"
      >
        <Text className="text-white font-inter-bold text-sm uppercase tracking-wider">
          Upgrade to Premium
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-brand-slateBg">
      {/* Header */}
      <View className="flex-row items-center px-6 pt-4 pb-4 bg-brand-bg border-b border-brand-border">
        <Pressable
          onPress={() => router.back()}
          className="p-2 bg-brand-slateBg rounded-full border border-brand-border active:opacity-80"
        >
          <Ionicons name="arrow-back" size={20} color={colors.navy} />
        </Pressable>
        <Text className="text-xl font-inter-bold text-brand-navy ml-4 flex-1 text-center pr-8">
          Financial Simulators
        </Text>
      </View>

      {/* Dynamic horizontal scrollable tabs */}
      <View className="bg-brand-bg border-b border-brand-border">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
        >
          <Pressable
            onPress={() => setActiveTab("momo")}
            className={`px-4 py-2.5 rounded-full border flex-row items-center ${
              activeTab === "momo" ? "bg-brand-emerald border-brand-emerald" : "bg-brand-slateBg border-brand-border"
            }`}
          >
            <Image
              source={require("../assets/images/momo-logo.png")}
              className="w-4 h-4 rounded-md mr-1.5"
              resizeMode="contain"
            />
            <Text className={`text-xs font-inter-bold ${activeTab === "momo" ? "text-white" : "text-brand-dark"}`}>
              MoMo Fees
            </Text>
          </Pressable>

          {["tbill", "loan", "tax", "inflation"].map((tab) => {
            const labelMap: Record<string, string> = {
              tbill: "T-Bill Yield",
              loan: "Loan Interest",
              tax: "Tax & Pension",
              inflation: "Inflation Eroder",
            };
            const iconMap: Record<string, string> = {
              tbill: "trending-up-outline",
              loan: "cash-outline",
              tax: "calculator-outline",
              inflation: "stats-chart-outline",
            };
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab as any)}
                className={`px-4 py-2.5 rounded-full border flex-row items-center ${
                  isActive ? "bg-brand-emerald border-brand-emerald" : "bg-brand-slateBg border-brand-border"
                }`}
              >
                <Ionicons name={iconMap[tab] as any} size={14} color={isActive ? "white" : "#94a3b8"} />
                <Text className={`text-xs font-inter-bold ml-1.5 ${isActive ? "text-white" : "text-brand-dark"}`}>
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

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="p-5" showsVerticalScrollIndicator={false}>
          
          {/* ── TAB 1: MOMO FEES ── */}
          {activeTab === "momo" && (
            <View className="gap-4">
              <View className="bg-brand-bg rounded-3xl p-5 border border-brand-border shadow-sm">
                <Text className="text-brand-gray text-xs font-inter-bold uppercase tracking-wider mb-3">Transaction Details</Text>
                
                <Text className="text-brand-dark font-inter-bold text-xs mb-1">Enter Amount (GH₵)</Text>
                <TextInput
                  value={momoAmount}
                  onChangeText={setMomoAmount}
                  keyboardType="numeric"
                  className="border border-brand-border rounded-xl p-3 text-base text-brand-dark bg-brand-slateBg/50 mb-4 font-inter-semibold"
                />

                <Text className="text-brand-dark font-inter-bold text-xs mb-2">Transaction Type</Text>
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
                        momoType === item.type ? "bg-brand-emerald/10 border-brand-emerald" : "bg-brand-bg border-brand-border"
                      }`}
                    >
                      <Text className={`text-[10px] font-inter-bold text-center ${momoType === item.type ? "text-brand-emerald" : "text-brand-dark"}`}>
                        {item.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text className="text-brand-dark font-inter-bold text-xs mb-2 mt-4">Network Operator</Text>
                <View className="flex-row gap-2">
                  {[
                    { id: "mtn", name: "MTN MoMo", image: require("../assets/images/momo-logo.png") },
                    { id: "telecel", name: "Telecel Cash", image: require("../assets/images/telecel-logo.png") },
                  ].map((op) => (
                    <Pressable
                      key={op.id}
                      onPress={() => setMomoOperator(op.id as any)}
                      className={`flex-1 p-2.5 rounded-xl border flex-row items-center justify-center ${
                        momoOperator === op.id ? "bg-brand-emerald/10 border-brand-emerald" : "bg-brand-bg border-brand-border"
                      }`}
                    >
                      <Image
                        source={op.image}
                        className="w-5 h-5 rounded-md mr-2"
                        resizeMode="contain"
                      />
                      <Text className={`text-[11px] font-inter-bold ${momoOperator === op.id ? "text-brand-emerald" : "text-brand-dark"}`}>
                        {op.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="bg-brand-bg rounded-3xl p-5 border border-brand-border shadow-sm">
                <Text className="text-brand-gray text-xs font-inter-bold uppercase tracking-wider mb-4">Fee Breakdown</Text>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-brand-gray text-sm">Principal Amount</Text>
                  <Text className="text-brand-dark font-inter-bold text-sm">GH₵ {parseFloat(momoAmount) || 0}</Text>
                </View>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-brand-gray text-sm">Network Fee</Text>
                  <Text className="text-brand-dark font-inter-bold text-sm">GH₵ {momoResults.fee}</Text>
                </View>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-brand-gray text-sm">E-Levy Charge (1%)</Text>
                  <Text className="text-brand-dark font-inter-bold text-sm">GH₵ {momoResults.elevy}</Text>
                </View>
                <View className="border-t border-brand-border pt-3 flex-row justify-between items-center mb-3">
                  <Text className="text-brand-emerald font-inter-bold text-sm">Total Fees Paid</Text>
                  <Text className="text-brand-emerald font-inter-bold text-sm">GH₵ {momoResults.totalCost}</Text>
                </View>
                <View className="border-t border-brand-border pt-4 flex-row justify-between items-center">
                  <Text className="text-brand-dark font-inter-bold text-base">Total Cost Deducted</Text>
                  <Text className="text-brand-dark font-inter-bold text-lg">GH₵ {momoResults.totalDeducted}</Text>
                </View>
                <Pressable
                  onPress={() => handleSaveResult("momo", "MoMo Fee Calculator", { amount: momoAmount, type: momoType, operator: momoOperator }, `Fee: GH₵${momoResults.totalCost}, Total: GH₵${momoResults.totalDeducted}`)}
                  className="mt-4 bg-brand-slateBg py-2.5 rounded-xl items-center flex-row justify-center gap-1.5 active:bg-brand-slateBg"
                >
                  <Ionicons name="bookmark-outline" size={14} color={colors.gray} />
                  <Text className="text-brand-dark text-xs font-inter-bold">Save Result</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* ── TAB 2: TREASURY BILL ── */}
          {activeTab === "tbill" && (
            <View>
              {!isPremium ? (
                renderPremiumLock("Ghana Treasury Bill Simulator", "Unlock advanced interactive yield estimators to project savings growth over standard 91, 182, and 364 days compound schedules.")
              ) : (
                <View className="gap-4">
                  <View className="bg-brand-bg rounded-3xl p-5 border border-brand-border shadow-sm">
                    <Text className="text-brand-gray text-xs font-inter-bold uppercase tracking-wider mb-2">Investment Parameters</Text>
                    <Text className="text-brand-dark font-inter-bold text-xs mb-1">Principal (GH₵)</Text>
                    <TextInput
                      value={tbillAmount}
                      onChangeText={setTbillAmount}
                      keyboardType="numeric"
                      className="border border-brand-border rounded-xl p-3 text-base text-brand-dark bg-brand-slateBg/50 mb-4 font-inter-semibold"
                    />
                    <Text className="text-brand-dark font-inter-bold text-xs mb-2">Select Tenure</Text>
                    <View className="flex-row gap-2">
                      {[91, 182, 364].map((days) => (
                        <Pressable
                          key={days}
                          onPress={() => setTbillTenure(days as any)}
                          className={`flex-1 p-3 rounded-xl border items-center justify-center ${
                            tbillTenure === days ? "bg-brand-emerald/10 border-brand-emerald" : "bg-brand-bg border-brand-border"
                          }`}
                        >
                          <Text className={`text-xs font-inter-bold ${tbillTenure === days ? "text-brand-emerald" : "text-brand-dark"}`}>
                            {days} Days
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <View className="bg-brand-bg rounded-3xl p-5 border border-brand-border shadow-sm">
                    <Text className="text-brand-gray text-xs font-inter-bold uppercase tracking-wider mb-4">Projected Earnings</Text>
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-brand-gray text-sm">Annual Interest Rate</Text>
                      <Text className="text-brand-emerald font-inter-bold text-sm">~{tbillResults.yieldRate}% p.a.</Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-brand-gray text-sm">Interest Earned</Text>
                      <Text className="text-brand-emerald font-inter-bold text-sm">+GH₵ {tbillResults.interest}</Text>
                    </View>
                    <View className="border-t border-brand-border pt-4 flex-row justify-between items-center">
                      <Text className="text-brand-dark font-inter-bold text-base">Maturity Balance</Text>
                      <Text className="text-brand-dark font-inter-bold text-lg">GH₵ {tbillResults.finalAmount}</Text>
                    </View>
                    <Pressable
                      onPress={() => handleSaveResult("tbill", "T-Bill Yield Calculator", { amount: tbillAmount, tenure: `${tbillTenure} days` }, `Interest: GH₵${tbillResults.interest}, Maturity: GH₵${tbillResults.finalAmount}`)}
                      className="mt-4 bg-brand-slateBg py-2.5 rounded-xl items-center flex-row justify-center gap-1.5 active:bg-brand-slateBg"
                    >
                      <Ionicons name="bookmark-outline" size={14} color={colors.gray} />
                      <Text className="text-brand-dark text-xs font-inter-bold">Save Result</Text>
                    </Pressable>
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
                <View className="gap-4">
                  <View className="bg-brand-bg rounded-3xl p-5 border border-brand-border shadow-sm">
                    <Text className="text-brand-gray text-xs font-inter-bold uppercase tracking-wider mb-2">Borrowing Details</Text>
                    <Text className="text-brand-dark font-inter-bold text-xs mb-1">Loan Amount (GH₵)</Text>
                    <TextInput
                      value={loanAmount}
                      onChangeText={setLoanAmount}
                      keyboardType="numeric"
                      className="border border-brand-border rounded-xl p-3 text-base text-brand-dark bg-brand-slateBg/50 mb-4 font-inter-semibold"
                    />
                    <Text className="text-brand-dark font-inter-bold text-xs mb-2">Loan Tenure (Months)</Text>
                    <View className="flex-row gap-2">
                      {[1, 2, 3].map((m) => (
                        <Pressable
                          key={m}
                          onPress={() => setLoanDuration(m as any)}
                          className={`flex-1 p-3 rounded-xl border items-center justify-center ${
                            loanDuration === m ? "bg-brand-emerald/10 border-brand-emerald" : "bg-brand-bg border-brand-border"
                          }`}
                        >
                          <Text className={`text-xs font-inter-bold ${loanDuration === m ? "text-brand-emerald" : "text-brand-dark"}`}>
                            {m} {m === 1 ? "Month" : "Months"}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                    <View className="flex-row gap-4">
                    <View className="flex-1 bg-red-50 border border-red-100 rounded-3xl p-4">
                      <Text className="text-red-700 font-inter-bold text-[10px] uppercase">Qwikloan (Mobile)</Text>
                      <Text className="text-brand-gray text-[10px] mt-2">Interest Paid</Text>
                      <Text className="text-red-600 text-base font-inter-bold">GH₵ {loanResults.qwikInterest}</Text>
                      <Text className="text-brand-gray text-[10px] mt-2">Total Owed</Text>
                      <Text className="text-red-800 text-lg font-inter-bold">GH₵ {loanResults.qwikTotal}</Text>
                    </View>

                    <View className="flex-1 bg-brand-emerald/5 border border-brand-emerald/20 rounded-3xl p-4">
                      <Text className="text-brand-emerald font-inter-bold text-[10px] uppercase">Bank Personal Loan</Text>
                      <Text className="text-brand-gray text-[10px] mt-2">Interest Paid</Text>
                      <Text className="text-brand-emerald text-base font-inter-bold">GH₵ {loanResults.bankInterest}</Text>
                      <Text className="text-brand-gray text-[10px] mt-2">Total Owed</Text>
                      <Text className="text-brand-emerald text-lg font-inter-bold">GH₵ {loanResults.bankTotal}</Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => handleSaveResult("loan", "Loan Interest Simulator", { amount: loanAmount, duration: `${loanDuration} months` }, `Qwikloan: GH₵${loanResults.qwikTotal}, Bank: GH₵${loanResults.bankTotal}`)}
                    className="mt-4 bg-brand-slateBg py-2.5 rounded-xl items-center flex-row justify-center gap-1.5 active:bg-brand-slateBg"
                  >
                    <Ionicons name="bookmark-outline" size={14} color={colors.gray} />
                    <Text className="text-brand-dark text-xs font-inter-bold">Save Result</Text>
                  </Pressable>
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
                <View className="gap-4">
                  <View className="bg-brand-bg rounded-3xl p-5 border border-brand-border shadow-sm">
                    <Text className="text-brand-gray text-xs font-inter-bold uppercase tracking-wider mb-2">Income Parameters</Text>
                    <Text className="text-brand-dark font-inter-bold text-xs mb-1">Gross Monthly Salary (GH₵)</Text>
                    <TextInput
                      value={salaryInput}
                      onChangeText={setSalaryInput}
                      keyboardType="numeric"
                      className="border border-brand-border rounded-xl p-3 text-base text-brand-dark bg-brand-slateBg/50 mb-2 font-inter-semibold"
                    />
                  </View>

                  <View className="bg-brand-bg rounded-3xl p-5 border border-brand-border shadow-sm">
                    <Text className="text-brand-gray text-xs font-inter-bold uppercase tracking-wider mb-4">Salary Audit Breakdown</Text>
                    
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-brand-gray text-sm font-inter-semibold">Gross Monthly Salary</Text>
                      <Text className="text-brand-dark font-inter-bold text-sm">GH₵ {parseFloat(salaryInput) || 0}</Text>
                    </View>
                    
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-brand-gray text-sm">SSNIT Deduction (Employee 5.5%)</Text>
                      <Text className="text-red-600 font-inter-bold text-sm">-GH₵ {taxResults.ssnit}</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-brand-gray text-sm">Taxable Income</Text>
                      <Text className="text-brand-dark font-inter-bold text-sm">GH₵ {taxResults.taxable}</Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-brand-gray text-sm">GRA PAYE Income Tax</Text>
                      <Text className="text-red-600 font-inter-bold text-sm">-GH₵ {taxResults.paye}</Text>
                    </View>

                    <View className="border-t border-brand-border pt-4 flex-row justify-between items-center mb-3">
                      <Text className="text-brand-dark font-inter-bold text-base">Net Take-Home Pay</Text>
                      <Text className="text-brand-emerald font-inter-bold text-lg">GH₵ {taxResults.net}</Text>
                    </View>

                    <View className="border-t border-brand-border pt-3 flex-row justify-between items-center">
                      <Text className="text-brand-gray text-xs font-inter-bold uppercase tracking-wider">SSNIT Employer (Bonus 13%)</Text>
                      <Text className="text-blue-800 font-inter-bold text-xs">+GH₵ {taxResults.employerSsnit}</Text>
                    </View>
                    <Pressable
                      onPress={() => handleSaveResult("tax", "Tax & Pension Planner", { salary: salaryInput }, `Net: GH₵${taxResults.net}, PAYE: GH₵${taxResults.paye}`)}
                      className="mt-4 bg-brand-slateBg py-2.5 rounded-xl items-center flex-row justify-center gap-1.5 active:bg-brand-slateBg"
                    >
                      <Ionicons name="bookmark-outline" size={14} color={colors.gray} />
                      <Text className="text-brand-dark text-xs font-inter-bold">Save Result</Text>
                    </Pressable>
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
                <View className="gap-4">
                  <View className="bg-brand-bg rounded-3xl p-5 border border-brand-border shadow-sm">
                    <Text className="text-brand-gray text-xs font-inter-bold uppercase tracking-wider mb-3">Inflation parameters</Text>
                    
                    <Text className="text-brand-dark font-inter-bold text-xs mb-1">Cash Principal (GH₵)</Text>
                    <TextInput
                      value={inflationPrincipal}
                      onChangeText={setInflationPrincipal}
                      keyboardType="numeric"
                      className="border border-brand-border rounded-xl p-3 text-base text-brand-dark bg-brand-slateBg/50 mb-3 font-inter-semibold"
                    />

                    <Text className="text-brand-dark font-inter-bold text-xs mb-1">Annual Inflation Rate (%)</Text>
                    <TextInput
                      value={inflationRate}
                      onChangeText={setInflationRate}
                      keyboardType="numeric"
                      className="border border-brand-border rounded-xl p-3 text-base text-brand-dark bg-brand-slateBg/50 mb-4 font-inter-semibold"
                    />

                    <Text className="text-brand-dark font-inter-bold text-xs mb-2">Time Horizon (Years)</Text>
                    <View className="flex-row gap-2">
                      {[1, 3, 5, 10].map((y) => (
                        <Pressable
                          key={y}
                          onPress={() => setInflationYears(y)}
                          className={`flex-1 p-2.5 rounded-xl border items-center justify-center ${
                            inflationYears === y ? "bg-brand-emerald/10 border-brand-emerald" : "bg-brand-bg border-brand-border"
                          }`}
                        >
                          <Text className={`text-xs font-inter-bold ${inflationYears === y ? "text-brand-emerald" : "text-brand-dark"}`}>
                            {y} Yr{y > 1 ? "s" : ""}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Erosion Results */}
                  <View className="bg-red-50 border border-red-100 rounded-3xl p-5">
                    <Text className="text-red-800 font-inter-bold text-xs uppercase tracking-wide">Holding Cash (Erosion Impact)</Text>
                    <Text className="text-brand-dark text-xs mt-1">{"If left under your mattress or in a basic pocket wallet:"}</Text>
                    <Text className="text-brand-gray text-[10px] mt-3 uppercase font-inter-bold">Lost Purchasing Power</Text>
                    <Text className="text-red-600 text-xl font-inter-bold">-GH₵ {inflationResults.erodedLoss}</Text>
                    <Text className="text-brand-gray text-[10px] mt-2 uppercase font-inter-bold">Real Value in {inflationYears} Yrs</Text>
                    <Text className="text-red-950 text-base font-inter-bold">GH₵ {inflationResults.erodedValue}</Text>
                  </View>

                  <View className="bg-brand-emerald/5 border border-brand-emerald/20 rounded-3xl p-5">
                    <Text className="text-brand-emerald font-inter-bold text-xs uppercase tracking-wide">Investing in T-Bills (Shielding Impact)</Text>
                    <Text className="text-brand-dark text-xs mt-1">If compounded yearly in 26% Government T-Bills:</Text>
                    <Text className="text-brand-gray text-[10px] mt-3 uppercase font-inter-bold">Nominal Value in {inflationYears} Yrs</Text>
                    <Text className="text-brand-emerald text-xl font-inter-bold">GH₵ {inflationResults.tbillValue}</Text>
                    <Text className="text-brand-gray text-[10px] mt-2 uppercase font-inter-bold">Adjusted Real Purchasing Power</Text>
                    <Text className="text-green-950 text-base font-inter-bold">GH₵ {inflationResults.realTbillPower}</Text>
                  </View>
                  <Pressable
                    onPress={() => handleSaveResult("inflation", "Inflation Eroder", { principal: inflationPrincipal, rate: `${inflationRate}%`, years: `${inflationYears}` }, `Eroded: GH₵${inflationResults.erodedLoss}, T-Bill hedge: GH₵${inflationResults.tbillValue}`)}
                    className="mt-4 bg-brand-slateBg py-2.5 rounded-xl items-center flex-row justify-center gap-1.5 active:bg-brand-slateBg"
                  >
                    <Ionicons name="bookmark-outline" size={14} color={colors.gray} />
                    <Text className="text-brand-dark text-xs font-inter-bold">Save Result</Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Simulation History */}
      {simulationHistory.length > 0 && (
        <View className="px-5 pb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-brand-gray text-[10px] font-inter-bold uppercase tracking-wider">RECENT RESULTS</Text>
            <Pressable onPress={() => useUserStore.getState().clearSimulationHistory()}>
              <Text className="text-brand-gray text-[10px] font-inter-bold">Clear</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {simulationHistory.map((sim) => (
              <View key={sim.id} className="bg-brand-bg border border-brand-border rounded-xl p-3 min-w-[160px]">
                <Text className="text-brand-dark text-[11px] font-inter-bold" numberOfLines={1}>{sim.label}</Text>
                <Text className="text-brand-gray text-[9px] mt-1" numberOfLines={1}>{sim.result}</Text>
                <Text className="text-brand-gray text-[8px] mt-1">
                  {new Date(sim.savedAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

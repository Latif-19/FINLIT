export type PlanId = "monthly" | "three_months" | "yearly";
export type MethodId = "momo" | "telecel" | "card";

export interface SubscriptionPlan {
  id: PlanId;
  title: string;
  price: string;
  period: string;
  badge?: string;
  desc: string;
}

export interface PaymentMethod {
  id: MethodId;
  name: string;
  icon?: string;
  image?: any;
  color: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "monthly",
    title: "Monthly Pass",
    price: "GH₵ 19.99",
    period: "month",
    desc: "Perfect for a quick learning sprint",
  },
  {
    id: "three_months",
    title: "Quarterly Saver",
    price: "GH₵ 49.99",
    period: "3 months",
    badge: "POPULAR",
    desc: "Saves 16% compared to monthly",
  },
  {
    id: "yearly",
    title: "Yearly Pro",
    price: "GH₵ 129.99",
    period: "year",
    badge: "BEST VALUE",
    desc: "Saves 45% — our ultimate package",
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "momo", name: "MTN MoMo", image: require("../assets/images/momo-logo.png"), color: "#facc15" },
  { id: "telecel", name: "Telecel Cash", image: require("../assets/images/telecel-logo.png"), color: "#ef4444" },
  { id: "card", name: "Credit/Debit Card", icon: "card", color: "#3b82f6" },
];

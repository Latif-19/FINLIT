export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: string;
  isUp: boolean;
}

export const MOCK_STOCKS: Stock[] = [
  { symbol: "MTNGH", name: "Scancom Plc (MTN Ghana)", price: 2.20, change: "+1.8%", isUp: true },
  { symbol: "GCB", name: "GCB Bank Limited", price: 5.50, change: "-0.4%", isUp: false },
  { symbol: "ETI", name: "Ecobank Transnational Inc.", price: 0.15, change: "0.0%", isUp: true },
];

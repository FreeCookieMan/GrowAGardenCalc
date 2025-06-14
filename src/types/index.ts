import type { EstimateMarketValueOutput } from '@/ai/flows/estimate-market-value';

export interface Mutation {
  id: string;
  value: number;
  amount: number;
  type: string;
}

export interface CalculationData {
  fruitBaseValue: number;
  fruitAmount: number;
  fruitType: string;
  mutations: Mutation[];
}

export interface CalculationState extends CalculationData {
  realTimeTotalValue: number;
  aiEstimate?: EstimateMarketValueOutput;
  isLoadingAiEstimate: boolean;
  aiError?: string | null;
}

// For saved results, we might only need input data
export interface SavedCalculation extends CalculationData {
  id: string;
  timestamp: number;
  realTimeTotalValue: number;
}

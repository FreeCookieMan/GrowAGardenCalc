
import type { EstimateMarketValueOutput } from '@/ai/flows/estimate-market-value';

export interface Mutation {
  id: string;
  type: string;
  valueMultiplier: number; // Changed from factor
}

export interface CalculationData {
  fruitBaseValue: number;
  fruitType: string;
  mutations: Mutation[];
}

export interface CalculationState extends CalculationData {
  realTimeTotalValue: number;
  aiEstimate?: EstimateMarketValueOutput;
  isLoadingAiEstimate: boolean;
  aiError?: string | null;
}

export interface SavedCalculation extends CalculationData {
  id: string;
  timestamp: number;
  realTimeTotalValue: number;
}

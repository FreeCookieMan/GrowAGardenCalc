
import type { EstimateMarketValueOutput } from '@/ai/flows/estimate-market-value';

export interface Mutation {
  id: string;
  type: string;
  valueMultiplier: number;
}

export type GrowthMutationType = "none" | "gold" | "rainbow";

export interface CalculationData {
  fruitType: string;
  basePrice: number;
  massKg: number;
  baseMassKg: number; // Added
  growthMutationType: GrowthMutationType;
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

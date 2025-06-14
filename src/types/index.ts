
import type { EstimateMarketValueOutput } from '@/ai/flows/estimate-market-value';

export interface Mutation {
  id: string;
  type: string;
  valueMultiplier: number;
}

export type GrowthMutationType = "none" | "gold" | "rainbow";

export interface CalculationData {
  fruitType: string;
  // Renamed from fruitBaseValue to align with new formula terminology
  basePrice: number; 
  massKg: number;
  baseMassKg: number;
  growthMutationType: GrowthMutationType;
  // These are now "Environmental Mutations"
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

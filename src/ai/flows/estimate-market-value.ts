
'use server';

/**
 * @fileOverview A flow to estimate the market value of a fruit based on a complex formula including mass, base price, growth mutations, and environmental mutations.
 *
 * - estimateMarketValue - A function that estimates the market value using the detailed formula.
 * - EstimateMarketValueInput - The input type for the estimateMarketValue function.
 * - EstimateMarketValueOutput - The return type for the estimateMarketValue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnvironmentalMutationInputSchema = z.object({
  type: z.string().describe('The type of the environmental mutation (e.g., Wet, Chilled).'),
  valueMultiplier: z.coerce.number().min(0, "Environmental mutation value multiplier must be non-negative.").describe('The multiplier associated with this environmental mutation (e.g., 2 for x2). This is used to calculate its bonus.'),
});

const EstimateMarketValueInputSchema = z.object({
  fruitType: z.string().describe('The type of fruit (e.g., Apple, Tomato).'),
  basePrice: z.coerce.number().min(0, "Base Price must be non-negative.").describe('The constant base price unique to this crop type.'),
  massKg: z.coerce.number().min(0, "Mass (kg) must be non-negative.").describe('The mass of the fruit in kilograms.'),
  baseMassKg: z.coerce.number().positive("Base Mass (kg) must be positive.").describe('The constant base mass for this crop type in kilograms. Used to calculate the Mass Factor.'),
  growthMutationType: z.enum(["none", "gold", "rainbow"]).describe('The type of growth mutation applied: "none" (x1), "gold" (x20), or "rainbow" (x50).'),
  environmentalMutations: z.array(EnvironmentalMutationInputSchema).describe('An array of applied environmental mutations. Each has a type and its own valueMultiplier.'),
});
export type EstimateMarketValueInput = z.infer<typeof EstimateMarketValueInputSchema>;

const EstimateMarketValueOutputSchema = z.object({
  estimatedMarketValue: z
    .number()
    .describe('The estimated fair market value of the item, calculated based on the provided formula and market considerations.'),
  reasoning: z.string().describe('The AI reasoning behind the estimated value, explaining how the formula components and market dynamics contribute to the final price.'),
});
export type EstimateMarketValueOutput = z.infer<typeof EstimateMarketValueOutputSchema>;

export async function estimateMarketValue(input: EstimateMarketValueInput): Promise<EstimateMarketValueOutput> {
  return estimateMarketValueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateMarketValuePrompt',
  input: {schema: EstimateMarketValueInputSchema},
  output: {schema: EstimateMarketValueOutputSchema},
  prompt: `You are an expert in determining the fair market value of agricultural products based on a specific, complex pricing formula and market dynamics.

The formula for the Total Price is:
Total Price = (Mass Factor) * Base Price * (Growth Mutation Multiplier) * (Environmental Factor)

Where each component is calculated as follows:

1.  **Mass Factor**:
    *   This is calculated based on 'Mass (kg)' and 'Base Mass (kg)'.
    *   If 'Mass (kg)' is less than 'Base Mass (kg)', or if 'Base Mass (kg)' is zero or negative (which shouldn't happen with valid inputs), the Mass Factor = 1.
    *   Otherwise, Mass Factor = ('Mass (kg)' / 'Base Mass (kg)')².
    *   So, Mass Factor = if (massKg >= baseMassKg AND baseMassKg > 0) then (massKg / baseMassKg)^2 else 1.

2.  **Base Price**: This is the given 'basePrice' for the fruit type.

3.  **Growth Mutation Multiplier**:
    *   If 'growthMutationType' is "none", Multiplier = 1.
    *   If 'growthMutationType' is "gold", Multiplier = 20.
    *   If 'growthMutationType' is "rainbow", Multiplier = 50.

4.  **Environmental Factor**:
    *   Calculated as: (1 + Sum of Environmental Mutation Bonuses - Number of Environmental Mutations).
    *   An **Environmental Mutation Bonus** for a single environmental mutation is its 'valueMultiplier' minus 1. For example, if an environmental mutation has a 'valueMultiplier' of 2 (like "Wet x2"), its bonus is (2 - 1) = 1. If its 'valueMultiplier' is 5 (like "Plasma x5"), its bonus is (5 - 1) = 4.
    *   **Sum of Environmental Mutation Bonuses** is the sum of these calculated bonuses for all applied 'environmentalMutations'.
    *   **Number of Environmental Mutations** is the count of items in the 'environmentalMutations' array.
    *   The final Environmental Factor must not be negative; if the calculation (1 + Sum Bonuses - Count) results in a negative number, use 0 instead. So, Environmental Factor = max(0, 1 + Sum_Bonuses - Count).

Based on these inputs and the formula, first calculate the raw price. Then, provide an 'estimatedMarketValue' that also considers market dynamics, rarity of the fruit type and mutations, and overall desirability, including any relevant considerations from the 'Mass (kg)' and its relation to 'Base Mass (kg)'. Your 'reasoning' should explain both the formula-based calculation and any market adjustments you apply.

Input Details:
- Fruit Type: {{{fruitType}}}
- Base Price: {{{basePrice}}}
- Mass (kg): {{{massKg}}}
- Base Mass (kg): {{{baseMassKg}}}
- Growth Mutation Type: {{{growthMutationType}}}
- Environmental Mutations:
  {{#if environmentalMutations}}
    {{#each environmentalMutations}}
    - Type: {{{this.type}}}, Value Multiplier: {{{this.valueMultiplier}}}
    {{/each}}
  {{else}}
    No environmental mutations.
  {{/if}}

Please provide the estimatedMarketValue and your detailed reasoning.
`,
});

const estimateMarketValueFlow = ai.defineFlow(
  {
    name: 'estimateMarketValueFlow',
    inputSchema: EstimateMarketValueInputSchema,
    outputSchema: EstimateMarketValueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

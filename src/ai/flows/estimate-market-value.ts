
'use server';

/**
 * @fileOverview A flow to estimate the market value of a modified fruit based on its base value and mutation factors.
 *
 * - estimateMarketValue - A function that estimates the market value of an item based on its fruit and mutation details.
 * - EstimateMarketValueInput - The input type for the estimateMarketValue function.
 * - EstimateMarketValueOutput - The return type for the estimateMarketValue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MutationInputSchema = z.object({
  type: z.string().describe('The type of the mutation.'),
  valueMultiplier: z.number().describe('The factor by which this mutation influences the value. A factor of 0.5 means a +50% modification to the current value (multiplies by 1.5).'), // Renamed from factor
});

const EstimateMarketValueInputSchema = z.object({
  fruitBaseValue: z.number().describe('The base value of the fruit.'),
  fruitType: z.string().describe('The type of fruit.'),
  mutations: z.array(MutationInputSchema).describe('An array of mutations, each with a type and a value multiplier. The total value is calculated by starting with the fruitBaseValue, and then for each mutation, multiplying the current value by (1 + mutation_value_multiplier).'), // Updated description
});
export type EstimateMarketValueInput = z.infer<typeof EstimateMarketValueInputSchema>;

const EstimateMarketValueOutputSchema = z.object({
  estimatedMarketValue: z
    .number()
    .describe('The estimated fair market value of the item.'),
  reasoning: z.string().describe('The AI reasoning behind the estimated value, considering the fruit type, base value, and the compounding impact of its mutations.'),
});
export type EstimateMarketValueOutput = z.infer<typeof EstimateMarketValueOutputSchema>;

export async function estimateMarketValue(input: EstimateMarketValueInput): Promise<EstimateMarketValueOutput> {
  return estimateMarketValueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateMarketValuePrompt',
  input: {schema: EstimateMarketValueInputSchema},
  output: {schema: EstimateMarketValueOutputSchema},
  prompt: `You are an expert in determining the fair market value of items based on their attributes.

You will be given the base value of a fruit and a list of its mutations.
The value of the fruit starts at its base value.
Each mutation then modifies this value: the item's current value is multiplied by (1 + the mutation's value multiplier).
For example, if the base value is 100 and a first mutation has a value multiplier of 0.5 (representing a +50% effect), the value becomes 100 * (1 + 0.5) = 150.
If a second mutation has a value multiplier of 0.2 (representing a +20% effect), the value then becomes 150 * (1 + 0.2) = 180.
The total pre-market calculated value is thus the fruitBaseValue multiplied by the product of (1 + value_multiplier_i) for all mutations.

Based on this information (fruit type, base value, and mutation details), determine the estimated fair market value of the item. Provide your reasoning, considering market dynamics, rarity, and desirability based on the fruit and its mutations.

Fruit Type: {{{fruitType}}}
Fruit Base Value: {{{fruitBaseValue}}}

Mutations:
{{#if mutations}}
  {{#each mutations}}
  - Mutation Type: {{{this.type}}}, Value Multiplier: {{{this.valueMultiplier}}} (compounds as multiply by (1 + {{{this.valueMultiplier}}}))
  {{/each}}
{{else}}
  No mutations.
{{/if}}

Please provide the estimatedMarketValue and your detailed reasoning.
`, // Updated prompt text and handlebars
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

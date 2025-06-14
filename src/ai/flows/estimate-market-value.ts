
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
  valueMultiplier: z.coerce.number().min(0, "Mutation value multiplier must be non-negative.").describe('The factor by which this mutation directly multiplies the current value. For example, a multiplier of 2 doubles the value, 0.5 halves it. Must be non-negative.'),
});

const EstimateMarketValueInputSchema = z.object({
  fruitBaseValue: z.coerce.number().min(0, "Fruit base value must be non-negative.").describe('The base value of the fruit. Must be non-negative.'),
  fruitType: z.string().describe('The type of fruit.'),
  mutations: z.array(MutationInputSchema).describe('An array of mutations, each with a type and a value multiplier. The total value is calculated by starting with the fruitBaseValue, and then for each mutation, multiplying the current value by that mutation\'s value_multiplier.'),
});
export type EstimateMarketValueInput = z.infer<typeof EstimateMarketValueInputSchema>;

const EstimateMarketValueOutputSchema = z.object({
  estimatedMarketValue: z
    .number()
    .describe('The estimated fair market value of the item.'),
  reasoning: z.string().describe('The AI reasoning behind the estimated value, considering the fruit type, base value, and the compounding impact of its mutations by direct multiplication.'),
});
export type EstimateMarketValueOutput = z.infer<typeof EstimateMarketValueOutputSchema>;

export async function estimateMarketValue(input: EstimateMarketValueInput): Promise<EstimateMarketValueOutput> {
  // The Genkit flow will now handle coercion and validation based on the updated schema.
  // Basic client-side validation helps, but server-side schema is authoritative.
  return estimateMarketValueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateMarketValuePrompt',
  input: {schema: EstimateMarketValueInputSchema},
  output: {schema: EstimateMarketValueOutputSchema},
  prompt: `You are an expert in determining the fair market value of items based on their attributes.

You will be given the base value of a fruit and a list of its mutations.
The value of the fruit starts at its base value.
Each mutation then modifies this value: the item's current value is multiplied directly by the mutation's value_multiplier.
For example, if the base value is 100 and a first mutation has a value_multiplier of 2, the value becomes 100 * 2 = 200.
If a second mutation has a value_multiplier of 0.5, the value then becomes 200 * 0.5 = 100.
The total pre-market calculated value is thus the fruitBaseValue multiplied by the product of all mutation value_multipliers. If a value_multiplier is 0, it makes the item worthless. If it's 1, it has no effect.

Based on this information (fruit type, base value, and mutation details), determine the estimated fair market value of the item. Provide your reasoning, considering market dynamics, rarity, and desirability based on the fruit and its mutations.

Fruit Type: {{{fruitType}}}
Fruit Base Value: {{{fruitBaseValue}}}

Mutations:
{{#if mutations}}
  {{#each mutations}}
  - Mutation Type: {{{this.type}}}, Value Multiplier: {{{this.valueMultiplier}}} (compounds as multiply by {{{this.valueMultiplier}}})
  {{/each}}
{{else}}
  No mutations.
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


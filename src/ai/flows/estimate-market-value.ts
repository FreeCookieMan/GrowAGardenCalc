
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
  factor: z.number().describe('The factor by which this mutation influences the value, relative to the base fruit value. E.g., a factor of 0.5 means the mutation adds an additional 50% of the base fruit value.'),
});

const EstimateMarketValueInputSchema = z.object({
  fruitBaseValue: z.number().describe('The base value of the fruit.'),
  fruitType: z.string().describe('The type of fruit.'),
  mutations: z.array(MutationInputSchema).describe('An array of mutations, each with a type and a factor. The total value is calculated as fruitBaseValue * (1 + sum of all mutation factors).'),
});
export type EstimateMarketValueInput = z.infer<typeof EstimateMarketValueInputSchema>;

const EstimateMarketValueOutputSchema = z.object({
  estimatedMarketValue: z
    .number()
    .describe('The estimated fair market value of the item.'),
  reasoning: z.string().describe('The AI reasoning behind the estimated value, considering the fruit type, base value, and the impact of its mutations.'),
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
The intrinsic value from the fruit itself is its base value.
Each mutation provides an additional value equal to its 'factor' multiplied by the fruit's base value.
For example, if the base value is 100 and a mutation has a factor of 0.5, that mutation contributes an additional (100 * 0.5) = 50 to the item's overall value.
The total pre-market calculated value is the fruit's base value plus the sum of these additional values from all mutations (i.e., fruitBaseValue * (1 + sum of all factors)).

Based on this information (fruit type, base value, and mutation details), determine the estimated fair market value of the item. Provide your reasoning, considering market dynamics, rarity, and desirability based on the fruit and its mutations.

Fruit Type: {{{fruitType}}}
Fruit Base Value: {{{fruitBaseValue}}}

Mutations:
{{#if mutations}}
  {{#each mutations}}
  - Mutation Type: {{{this.type}}}, Factor: {{{this.factor}}}
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

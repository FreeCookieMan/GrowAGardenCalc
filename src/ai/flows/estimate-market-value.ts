// estimate-market-value.ts
'use server';

/**
 * @fileOverview A flow to estimate the market value of a modified fruit based on its base value and mutations.
 *
 * - estimateMarketValue - A function that estimates the market value of an item based on its fruit and mutation details.
 * - EstimateMarketValueInput - The input type for the estimateMarketValue function.
 * - EstimateMarketValueOutput - The return type for the estimateMarketValue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateMarketValueInputSchema = z.object({
  fruitBaseValue: z.number().describe('The base value of the fruit.'),
  fruitAmount: z.number().describe('The amount of the fruit.'),
  mutationValues: z
    .array(z.number())
    .describe('An array of the values of each mutation.'),
  mutationAmounts: z
    .array(z.number())
    .describe('An array of the amounts of each mutation.'),
  fruitType: z.string().describe('The type of fruit.'),
  mutationTypes: z
    .array(z.string())
    .describe('An array of the types of each mutation.'),
});
export type EstimateMarketValueInput = z.infer<typeof EstimateMarketValueInputSchema>;

const EstimateMarketValueOutputSchema = z.object({
  estimatedMarketValue: z
    .number()
    .describe('The estimated fair market value of the item.'),
  reasoning: z.string().describe('The AI reasoning behind the estimated value.'),
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

You will be given the base value of a fruit, the amount of the fruit, the values of its mutations, and the amounts of each mutation.

Based on this information, you will determine the estimated fair market value of the item, and the reasoning behind your estimation.

Fruit Type: {{{fruitType}}}
Fruit Base Value: {{{fruitBaseValue}}}
Fruit Amount: {{{fruitAmount}}}

{{#each mutationValues}}
Mutation Value {{@index}}: {{{this}}}
{{/each}}

{{#each mutationAmounts}}
Mutation Amount {{@index}}: {{{this}}}
{{/each}}

{{#each mutationTypes}}
Mutation Type {{@index}}: {{{this}}}
{{/each}}
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


"use client";

import type { Control, FormState, UseFieldArrayReturn } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Apple, Carrot, Leaf, Grape, Flower2, Sprout, Bean,
  Sparkles, PlusCircle, XCircle, Calculator,
  Award, Zap
} from "lucide-react";
import type { CalculationData, GrowthMutationType } from "@/types";
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";

interface ValueInputFormProps {
  control: Control<CalculationData>;
  formState: FormState<CalculationData>;
  fieldArray: UseFieldArrayReturn<CalculationData, "mutations", "id">;
  onSubmitMarketValue: () => void;
  isEstimatingMarketValue: boolean;
}

export const fruitTypes = [
  { value: "Carrot", label: "Carrot", icon: <Carrot className="w-4 h-4 mr-2" />, basePrice: 20, baseMassKg: 0.1, themeColor: "hsla(28, 87%, 80%, 0.1)" },
  { value: "Strawberry", label: "Strawberry", icon: <Leaf className="w-4 h-4 mr-2" />, basePrice: 14, baseMassKg: 0.02, themeColor: "hsla(0, 85%, 88%, 0.1)" },
  { value: "Blueberry", label: "Blueberry", icon: <Grape className="w-4 h-4 mr-2" />, basePrice: 18, baseMassKg: 0.1, themeColor: "hsla(220, 75%, 88%, 0.1)" },
  { value: "Orange Tulip", label: "Orange Tulip", icon: <Flower2 className="w-4 h-4 mr-2" />, basePrice: 767, baseMassKg: 0.05, themeColor: "hsla(30, 90%, 82%, 0.1)" },
  { value: "Tomato", label: "Tomato", icon: <Apple className="w-4 h-4 mr-2" />, basePrice: 27, baseMassKg: 0.15, themeColor: "hsla(5, 88%, 85%, 0.1)" },
  { value: "Corn", label: "Corn", icon: <Leaf className="w-4 h-4 mr-2" />, basePrice: 36, baseMassKg: 0.3, themeColor: "hsla(50, 95%, 85%, 0.12)" },
  { value: "Daffodil", label: "Daffodil", icon: <Flower2 className="w-4 h-4 mr-2" />, basePrice: 903, baseMassKg: 0.05, themeColor: "hsla(55, 90%, 82%, 0.1)" },
  { value: "Watermelon", label: "Watermelon", icon: <Leaf className="w-4 h-4 mr-2" />, basePrice: 2708, baseMassKg: 3.0, themeColor: "hsla(135, 60%, 85%, 0.1)" },
  { value: "Pumpkin", label: "Pumpkin", icon: <Sprout className="w-4 h-4 mr-2" />, basePrice: 3700, baseMassKg: 2.0, themeColor: "hsla(30, 90%, 82%, 0.1)" },
  { value: "Apple", label: "Apple", icon: <Apple className="w-4 h-4 mr-2" />, basePrice: 248, baseMassKg: 0.15, themeColor: "hsla(90, 65%, 85%, 0.1)"},
  { value: "Bamboo", label: "Bamboo", icon: <Sprout className="w-4 h-4 mr-2" />, basePrice: 3610, baseMassKg: 0.5, themeColor: "hsla(110, 55%, 85%, 0.1)" },
  { value: "Coconut", label: "Coconut", icon: <Sprout className="w-4 h-4 mr-2" />, basePrice: 361, baseMassKg: 0.8, themeColor: "hsla(35, 40%, 88%, 0.1)" },
  { value: "Cactus", label: "Cactus", icon: <Sprout className="w-4 h-4 mr-2" />, basePrice: 3068, baseMassKg: 0.5, themeColor: "hsla(100, 50%, 85%, 0.1)" },
  { value: "Dragon Fruit", label: "Dragon Fruit", icon: <Leaf className="w-4 h-4 mr-2" />, basePrice: 4287, baseMassKg: 0.3, themeColor: "hsla(320, 75%, 88%, 0.1)" },
  { value: "Mango", label: "Mango", icon: <Leaf className="w-4 h-4 mr-2" />, basePrice: 5866, baseMassKg: 0.2, themeColor: "hsla(40, 90%, 82%, 0.1)" },
  { value: "Grape", label: "Grape", icon: <Grape className="w-4 h-4 mr-2" />, basePrice: 7085, baseMassKg: 0.3, themeColor: "hsla(270, 65%, 88%, 0.1)" },
  { value: "Mushroom", label: "Mushroom", icon: <Sprout className="w-4 h-4 mr-2"/>, basePrice: 136278, baseMassKg: 0.05, themeColor: "hsla(30, 25%, 85%, 0.08)"},
  { value: "Pepper", label: "Pepper", icon: <Leaf className="w-4 h-4 mr-2" />, basePrice: 7220, baseMassKg: 0.1, themeColor: "hsla(0, 80%, 85%, 0.1)" },
  { value: "Cacao", label: "Cacao", icon: <Bean className="w-4 h-4 mr-2" />, basePrice: 10830, baseMassKg: 5.28, themeColor: "hsla(25, 55%, 82%, 0.1)" },
  { value: "Beanstalk", label: "Beanstalk", icon: <Sprout className="w-4 h-4 mr-2" />, basePrice: 25270, baseMassKg: 1.0, themeColor: "hsla(120, 60%, 80%, 0.1)" },
  { value: "Ember Lily", label: "Ember Lily", icon: <Flower2 className="w-4 h-4 mr-2" />, basePrice: 50000, baseMassKg: 0.05, themeColor: "hsla(15, 90%, 80%, 0.12)" },
];

const growthMutationOptions: { value: GrowthMutationType; label: string; icon: JSX.Element, multiplier: number }[] = [
  { value: "none", label: "None (x1)", icon: <XCircle className="w-4 h-4 mr-2 text-muted-foreground" />, multiplier: 1 },
  { value: "gold", label: "Gold (x20)", icon: <Award className="w-4 h-4 mr-2 text-yellow-500" />, multiplier: 20 },
  { value: "rainbow", label: "Rainbow (x50)", icon: <Zap className="w-4 h-4 mr-2 text-purple-500" />, multiplier: 50 },
];

const environmentalMutationTypes = [
    { value: "Wet", label: "Wet (x2)", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 2 },
    { value: "Chilled", label: "Chilled (x2)", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 2 },
    { value: "Choc", label: "Choc (x2)", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 2 },
    { value: "Moonlit", label: "Moonlit (x2)", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 2 },
    { value: "Pollinated", label: "Pollinated (x3)", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 3 },
    { value: "Bloodlit", label: "Bloodlit (x4)", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 4 },
    { value: "Plasma", label: "Plasma (x5)", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 5 },
    { value: "HoneyGlazed", label: "HoneyGlazed (x5)", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 5 },
    { value: "Heavenly", label: "Heavenly (x5)", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 5 },
    { value: "Frozen", label: "Frozen (x10)", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 10 },
    { value: "Zombified", label: "Zombified (x25)", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 25 },
    { value: "Shocked", label: "Shocked (x100)", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 100 },
    { value: "Celestial", label: "Celestial (x120)", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 120 },
    { value: "Disco", label: "Disco (x125)", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 125 },
    { value: "Voidtouched", label: "Voidtouched (x135)", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 135 },
    { value: "Dawnbound", label: "Dawnbound (x150)", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 150 },
];


export function ValueInputForm({
  control,
  formState,
  fieldArray: { fields, append, remove },
  onSubmitMarketValue,
  isEstimatingMarketValue,
}: ValueInputFormProps) {
  const { setValue } = useFormContext<CalculationData>();

  const addEnvironmentalMutationField = () => {
    const defaultMutation = environmentalMutationTypes[0] || { value: "Wet", defaultMultiplier: 2.0 };
    append({
      id: "mutation-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
      type: defaultMutation.value,
      valueMultiplier: defaultMutation.defaultMultiplier
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Item Details</CardTitle>
        <CardDescription>Enter fruit properties and mutations according to the pricing formula.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <FormField
            control={control}
            name="fruitType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fruit Type</FormLabel>
                <Select
                  onValueChange={(newType) => {
                    field.onChange(newType);
                    const selectedFruit = fruitTypes.find(f => f.value === newType);
                    if (selectedFruit) {
                      setValue('basePrice', selectedFruit.basePrice);
                      setValue('baseMassKg', selectedFruit.baseMassKg);
                    }
                  }}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger id="fruitType">
                      <SelectValue placeholder="Select fruit type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fruitTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">{type.icon}{type.label}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Price (Fixed per Fruit)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 10"
                    {...field}
                    value={field.value === null || field.value === undefined || (typeof field.value === 'number' && isNaN(field.value)) ? '' : String(field.value)}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="massKg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mass (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 0.5"
                    {...field}
                    onChange={event => field.onChange(event.target.value === '' ? '' : event.target.valueAsNumber)}
                    value={field.value === null || field.value === undefined || (typeof field.value === 'number' && isNaN(field.value)) ? '' : String(field.value)}
                    min="0"
                    step="any"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="baseMassKg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Mass (kg) (Fixed per Fruit)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 1.0"
                    {...field}
                    value={field.value === null || field.value === undefined || (typeof field.value === 'number' && isNaN(field.value)) ? '' : String(field.value)}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="growthMutationType"
            render={({ field }) => (
              <FormItem className="md:col-span-2"> 
                <FormLabel>Growth Mutation</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger id="growthMutationType">
                      <SelectValue placeholder="Select growth mutation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {growthMutationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">{option.icon}{option.label}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">Environmental Mutations</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 border rounded-md shadow-sm bg-background/50 relative">
              <FormField
                control={control}
                name={`mutations.${index}.type`}
                render={({ field: selectField }) => (
                  <FormItem>
                    <FormLabel>Env. Mutation Type</FormLabel>
                     <Select
                        onValueChange={(newType) => {
                          selectField.onChange(newType);
                          const selectedMutation = environmentalMutationTypes.find(m => m.value === newType);
                          if (selectedMutation) {
                            setValue(`mutations.${index}.valueMultiplier`, selectedMutation.defaultMultiplier);
                          }
                        }}
                        defaultValue={String(selectField.value)}
                      >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mutation type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {environmentalMutationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center">{type.icon}{type.label}</div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`mutations.${index}.valueMultiplier`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Value Multiplier (Fixed)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 1.5"
                        {...inputField}
                        value={inputField.value === null || inputField.value === undefined || (typeof inputField.value === 'number' && isNaN(inputField.value)) ? '' : String(inputField.value)}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-destructive hover:bg-destructive/10 md:col-start-3 md:justify-self-end"
                aria-label="Remove environmental mutation"
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addEnvironmentalMutationField}
            className="w-full border-dashed hover:border-solid hover:bg-accent/20"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Environmental Mutation
          </Button>
        </div>

        <Button
          type="button"
          onClick={onSubmitMarketValue}
          disabled={isEstimatingMarketValue || !formState.isValid}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          <Calculator className="w-5 h-5 mr-2" />
          {isEstimatingMarketValue ? "Estimating..." : "Estimate Market Value (AI)"}
        </Button>
      </CardContent>
    </Card>
  );
}

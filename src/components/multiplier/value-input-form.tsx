
"use client";

import type { Control, FormState, UseFieldArrayReturn } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Apple, 
  Carrot, 
  Leaf, 
  Grape, 
  Flower2, 
  Sprout, 
  Bean, 
  Sparkles, 
  PlusCircle, 
  XCircle, 
  Calculator 
} from "lucide-react";
import type { CalculationData } from "@/types";
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";

interface ValueInputFormProps {
  control: Control<CalculationData>;
  formState: FormState<CalculationData>;
  fieldArray: UseFieldArrayReturn<CalculationData, "mutations", "id">;
  onSubmitMarketValue: () => void;
  isEstimatingMarketValue: boolean;
}

const fruitTypes = [
  { value: "Carrot", label: "Carrot", icon: <Carrot className="w-4 h-4 mr-2" /> },
  { value: "Strawberry", label: "Strawberry", icon: <Leaf className="w-4 h-4 mr-2" /> },
  { value: "Blueberry", label: "Blueberry", icon: <Grape className="w-4 h-4 mr-2" /> },
  { value: "Orange Tulip", label: "Orange Tulip", icon: <Flower2 className="w-4 h-4 mr-2" /> },
  { value: "Tomato", label: "Tomato", icon: <Apple className="w-4 h-4 mr-2" /> },
  { value: "Corn", label: "Corn", icon: <Leaf className="w-4 h-4 mr-2" /> },
  { value: "Daffodil", label: "Daffodil", icon: <Flower2 className="w-4 h-4 mr-2" /> },
  { value: "Watermelon", label: "Watermelon", icon: <Leaf className="w-4 h-4 mr-2" /> },
  { value: "Pumpkin", label: "Pumpkin", icon: <Sprout className="w-4 h-4 mr-2" /> },
  { value: "Apple", label: "Apple", icon: <Apple className="w-4 h-4 mr-2" /> },
  { value: "Bamboo", label: "Bamboo", icon: <Sprout className="w-4 h-4 mr-2" /> },
  { value: "Coconut", label: "Coconut", icon: <Sprout className="w-4 h-4 mr-2" /> }, 
  { value: "Cactus", label: "Cactus", icon: <Sprout className="w-4 h-4 mr-2" /> },
  { value: "Dragon Fruit", label: "Dragon Fruit", icon: <Leaf className="w-4 h-4 mr-2" /> },
  { value: "Mango", label: "Mango", icon: <Leaf className="w-4 h-4 mr-2" /> },
  { value: "Grape", label: "Grape", icon: <Grape className="w-4 h-4 mr-2" /> },
  { value: "Pepper", label: "Pepper", icon: <Leaf className="w-4 h-4 mr-2" /> },
  { value: "Cacao", label: "Cacao", icon: <Bean className="w-4 h-4 mr-2" /> },
  { value: "Beanstalk", label: "Beanstalk", icon: <Sprout className="w-4 h-4 mr-2" /> },
  { value: "Ember Lily", label: "Ember Lily", icon: <Flower2 className="w-4 h-4 mr-2" /> },
];

const mutationTypes = [
  { value: "Wet", label: "Wet", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 2 },
  { value: "Chilled", label: "Chilled", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 2 },
  { value: "Choc", label: "Choc", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 2 },
  { value: "Moonlit", label: "Moonlit", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 2 },
  { value: "Pollinated", label: "Pollinated", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 3 },
  { value: "Bloodlit", label: "Bloodlit", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 4 },
  { value: "Plasma", label: "Plasma", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 5 },
  { value: "HoneyGlazed", label: "HoneyGlazed", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 5 },
  { value: "Heavenly", label: "Heavenly", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 5 },
  { value: "Frozen", label: "Frozen", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 10 },
  { value: "Golden", label: "Golden", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 20 },
  { value: "Zombified", label: "Zombified", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 25 },
  { value: "Rainbow", label: "Rainbow", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 50 },
  { value: "Shocked", label: "Shocked", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 100 },
  { value: "Celestial", label: "Celestial", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 120 },
  { value: "Disco", label: "Disco", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 125 },
  { value: "Voidtouched", label: "Voidtouched", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 135 },
  { value: "Dawnbound", label: "Dawnbound", icon: <Sparkles className="w-4 h-4 mr-2" />, defaultMultiplier: 150 },
];


export function ValueInputForm({
  control,
  formState,
  fieldArray: { fields, append, remove },
  onSubmitMarketValue,
  isEstimatingMarketValue,
}: ValueInputFormProps) {
  const { setValue } = useFormContext<CalculationData>();

  const addMutationField = () => {
    const defaultMutation = mutationTypes[0] || { value: "Wet", defaultMultiplier: 2.0 };
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
        <CardDescription>Enter the base value for your fruit and its mutations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          
          <FormField
            control={control}
            name="fruitType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fruit Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
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
            name="fruitBaseValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fruit Base Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 10"
                    {...field}
                    onChange={event => field.onChange(event.target.value)} 
                    value={field.value === null || field.value === undefined || (typeof field.value === 'number' && isNaN(field.value)) ? '' : String(field.value)} 
                    min="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">Mutations</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 border rounded-md shadow-sm bg-background/50 relative">
              <FormField
                control={control}
                name={`mutations.${index}.type`}
                render={({ field: selectField }) => (
                  <FormItem>
                    <FormLabel>Mutation Type</FormLabel>
                     <Select 
                        onValueChange={(newType) => {
                          selectField.onChange(newType);
                          const selectedMutation = mutationTypes.find(m => m.value === newType);
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
                        {mutationTypes.map((type) => (
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
                    <FormLabel>Value Multiplier</FormLabel>
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
                aria-label="Remove mutation"
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addMutationField} 
            className="w-full border-dashed hover:border-solid hover:bg-accent/20"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Mutation
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



"use client";

import type { Control, FormState, UseFieldArrayReturn } from "react-hook-form";
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
  // Coconut, // This icon does not exist
  Bean, 
  Sparkles, 
  Sun, 
  Gem, 
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
  { value: "Strawberry", label: "Strawberry", icon: <Leaf className="w-4 h-4 mr-2" /> }, // Using Leaf as a generic berry icon
  { value: "Blueberry", label: "Blueberry", icon: <Grape className="w-4 h-4 mr-2" /> }, // Using Grape as a generic berry icon
  { value: "Orange Tulip", label: "Orange Tulip", icon: <Flower2 className="w-4 h-4 mr-2" /> },
  { value: "Tomato", label: "Tomato", icon: <Apple className="w-4 h-4 mr-2" /> }, // Using Apple as a generic round fruit
  { value: "Corn", label: "Corn", icon: <Leaf className="w-4 h-4 mr-2" /> }, // Using Leaf as a generic plant/veg
  { value: "Daffodil", label: "Daffodil", icon: <Flower2 className="w-4 h-4 mr-2" /> },
  { value: "Watermelon", label: "Watermelon", icon: <Leaf className="w-4 h-4 mr-2" /> }, // Using Leaf as generic
  { value: "Pumpkin", label: "Pumpkin", icon: <Sprout className="w-4 h-4 mr-2" /> }, // Using Sprout for pumpkin
  { value: "Apple", label: "Apple", icon: <Apple className="w-4 h-4 mr-2" /> },
  { value: "Bamboo", label: "Bamboo", icon: <Sprout className="w-4 h-4 mr-2" /> },
  { value: "Coconut", label: "Coconut", icon: <Sprout className="w-4 h-4 mr-2" /> }, // Replaced non-existent Coconut with Sprout
  { value: "Cactus", label: "Cactus", icon: <Sprout className="w-4 h-4 mr-2" /> },
  { value: "Dragon Fruit", label: "Dragon Fruit", icon: <Leaf className="w-4 h-4 mr-2" /> }, // Using Leaf as generic
  { value: "Mango", label: "Mango", icon: <Leaf className="w-4 h-4 mr-2" /> }, // Using Leaf as generic
  { value: "Grape", label: "Grape", icon: <Grape className="w-4 h-4 mr-2" /> },
  { value: "Pepper", label: "Pepper", icon: <Leaf className="w-4 h-4 mr-2" /> }, // Using Leaf as generic
  { value: "Cacao", label: "Cacao", icon: <Bean className="w-4 h-4 mr-2" /> },
  { value: "Beanstalk", label: "Beanstalk", icon: <Sprout className="w-4 h-4 mr-2" /> },
  { value: "Ember Lily", label: "Ember Lily", icon: <Flower2 className="w-4 h-4 mr-2" /> },
];

const mutationTypes = [
  { value: "Sparkle", label: "Sparkle", icon: <Sparkles className="w-4 h-4 mr-2" /> },
  { value: "Glow", label: "Glow", icon: <Sun className="w-4 h-4 mr-2" /> },
  { value: "Crystal", label: "Crystal", icon: <Gem className="w-4 h-4 mr-2" /> },
  { value: "Generic", label: "Generic Mutation", icon: <Sparkles className="w-4 h-4 mr-2 text-muted-foreground" />},
];

export function ValueInputForm({
  control,
  formState,
  fieldArray: { fields, append, remove },
  onSubmitMarketValue,
  isEstimatingMarketValue,
}: ValueInputFormProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Item Details</CardTitle>
        <CardDescription>Enter the base values for your fruit and its mutations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          
          <FormField
            control={control}
            name="fruitType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fruit Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    placeholder="e.g., 100"
                    {...field}
                    onChange={event => field.onChange(+event.target.value)}
                    min="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="fruitAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fruit Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 1"
                    {...field}
                    onChange={event => field.onChange(+event.target.value)}
                    min="1"
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
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start p-4 border rounded-md shadow-sm bg-background/50 relative">
              <FormField
                control={control}
                name={`mutations.${index}.type`}
                render={({ field: selectField }) => (
                  <FormItem>
                    <FormLabel>Mutation Type</FormLabel>
                     <Select onValueChange={selectField.onChange} defaultValue={selectField.value}>
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
                name={`mutations.${index}.value`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Mutation Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 50"
                        {...inputField}
                        onChange={event => inputField.onChange(+event.target.value)}
                        min="0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`mutations.${index}.amount`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Mutation Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 1"
                        {...inputField}
                        onChange={event => inputField.onChange(+event.target.value)}
                        min="1"
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
                className="text-destructive hover:bg-destructive/10 self-center mt-4 md:mt-0 md:justify-self-end" 
                aria-label="Remove mutation"
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ id: "new-mutation-" + Date.now() + Math.random().toString(36).substr(2,9) , value: 0, amount: 1, type: "Generic" })}
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

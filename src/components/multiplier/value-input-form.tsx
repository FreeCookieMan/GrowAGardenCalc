
"use client";

import type { Control, UseFieldArrayReturn, FormState } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // This is ShadCN's generic Label
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Apple, Banana, Cherry, Sparkles, Sun, Gem, PlusCircle, XCircle, Calculator } from "lucide-react";
import type { CalculationData } from "@/types";
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form"; // Added FormLabel

interface ValueInputFormProps {
  control: Control<CalculationData>;
  formState: FormState<CalculationData>;
  fieldArray: UseFieldArrayReturn<CalculationData, "mutations", "id">;
  onSubmitMarketValue: () => void;
  isEstimatingMarketValue: boolean;
}

const fruitTypes = [
  { value: "Apple", label: "Apple", icon: <Apple className="w-4 h-4 mr-2" /> },
  { value: "Banana", label: "Banana", icon: <Banana className="w-4 h-4 mr-2" /> },
  { value: "Cherry", label: "Cherry", icon: <Cherry className="w-4 h-4 mr-2" /> },
  { value: "Generic", label: "Generic Fruit", icon: <Apple className="w-4 h-4 mr-2 text-muted-foreground" />},
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
  const { errors } = formState; // errors for manual class application if needed, FormMessage handles display

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
                <FormLabel>Fruit Type</FormLabel> {/* Changed to FormLabel */}
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger id="fruitType"> {/* id can be removed if FormLabel is used as it handles htmlFor */}
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
                <FormLabel>Fruit Base Value</FormLabel> {/* Changed to FormLabel */}
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 100"
                    {...field}
                    onChange={event => field.onChange(+event.target.value)}
                    min="0"
                    // className={errors.fruitBaseValue ? "border-destructive" : ""} // FormField handles error styling
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
                <FormLabel>Fruit Amount</FormLabel> {/* Changed to FormLabel */}
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 1"
                    {...field}
                    onChange={event => field.onChange(+event.target.value)}
                    min="1"
                    // className={errors.fruitAmount ? "border-destructive" : ""} // FormField handles error styling
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
                    <FormLabel>Mutation Type</FormLabel> {/* Changed to FormLabel */}
                     <Select onValueChange={selectField.onChange} defaultValue={selectField.value}>
                      <FormControl>
                        <SelectTrigger> {/* id can be removed */}
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
                    <FormLabel>Mutation Value</FormLabel> {/* Changed to FormLabel */}
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 50"
                        {...inputField}
                        onChange={event => inputField.onChange(+event.target.value)}
                        min="0"
                        // className={errors.mutations?.[index]?.value ? "border-destructive" : ""}
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
                    <FormLabel>Mutation Amount</FormLabel> {/* Changed to FormLabel */}
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 1"
                        {...inputField}
                        onChange={event => inputField.onChange(+event.target.value)}
                        min="1"
                        // className={errors.mutations?.[index]?.amount ? "border-destructive" : ""}
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
          type="button" // Changed from submit, onSubmitMarketValue is used
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


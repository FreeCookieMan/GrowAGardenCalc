"use client";

import type { Control, UseFieldArrayReturn, UseFormRegister, FormState } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Apple, Banana, Cherry, Sparkles, Sun, Gem, PlusCircle, XCircle, Calculator } from "lucide-react";
import type { CalculationData } from "@/types";

interface ValueInputFormProps {
  control: Control<CalculationData>;
  register: UseFormRegister<CalculationData>;
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
  register,
  formState: { errors },
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="fruitType">Fruit Type</Label>
             <Select 
              defaultValue="Apple" 
              onValueChange={(value) => control._formValues.fruitType = value} // react-hook-form handles this via register for Controller, but this is direct for simple Select. For proper form integration, use FormField with Controller.
            >
              <SelectTrigger id="fruitType">
                <SelectValue placeholder="Select fruit type" />
              </SelectTrigger>
              <SelectContent>
                {fruitTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center">{type.icon}{type.label}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Hidden input to register fruitType with react-hook-form */}
            <input type="hidden" {...register("fruitType")} />
            {errors.fruitType && <p className="text-destructive text-sm mt-1">{errors.fruitType.message}</p>}
          </div>
          <div>
            <Label htmlFor="fruitBaseValue">Fruit Base Value</Label>
            <Input
              id="fruitBaseValue"
              type="number"
              placeholder="e.g., 100"
              {...register("fruitBaseValue", { valueAsNumber: true, required: "Base value is required", min: { value: 0, message: "Must be non-negative"} })}
              min="0"
              className={errors.fruitBaseValue ? "border-destructive" : ""}
            />
            {errors.fruitBaseValue && <p className="text-destructive text-sm mt-1">{errors.fruitBaseValue.message}</p>}
          </div>
          <div>
            <Label htmlFor="fruitAmount">Fruit Amount</Label>
            <Input
              id="fruitAmount"
              type="number"
              placeholder="e.g., 1"
              {...register("fruitAmount", { valueAsNumber: true, required: "Amount is required", min: { value: 1, message: "Must be at least 1"} })}
              min="1"
              className={errors.fruitAmount ? "border-destructive" : ""}
            />
            {errors.fruitAmount && <p className="text-destructive text-sm mt-1">{errors.fruitAmount.message}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">Mutations</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 border rounded-md shadow-sm bg-background/50 relative">
              <div>
                <Label htmlFor={`mutations.${index}.type`}>Mutation Type</Label>
                 <Select 
                  defaultValue={field.type}
                  onValueChange={(value) => control._formValues.mutations[index].type = value}
                >
                  <SelectTrigger id={`mutations.${index}.type`}>
                    <SelectValue placeholder="Select mutation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mutationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">{type.icon}{type.label}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register(`mutations.${index}.type`)} />
                {errors.mutations?.[index]?.type && <p className="text-destructive text-sm mt-1">{errors.mutations[index]?.type?.message}</p>}
              </div>
              <div>
                <Label htmlFor={`mutations.${index}.value`}>Mutation Value</Label>
                <Input
                  id={`mutations.${index}.value`}
                  type="number"
                  placeholder="e.g., 50"
                  {...register(`mutations.${index}.value`, { valueAsNumber: true, required: "Value is required", min: { value: 0, message: "Must be non-negative"} })}
                  min="0"
                  className={errors.mutations?.[index]?.value ? "border-destructive" : ""}
                />
                {errors.mutations?.[index]?.value && <p className="text-destructive text-sm mt-1">{errors.mutations[index]?.value?.message}</p>}
              </div>
              <div>
                <Label htmlFor={`mutations.${index}.amount`}>Mutation Amount</Label>
                <Input
                  id={`mutations.${index}.amount`}
                  type="number"
                  placeholder="e.g., 1"
                  {...register(`mutations.${index}.amount`, { valueAsNumber: true, required: "Amount is required", min: { value: 1, message: "Must be at least 1"} })}
                  min="1"
                  className={errors.mutations?.[index]?.amount ? "border-destructive" : ""}
                />
                {errors.mutations?.[index]?.amount && <p className="text-destructive text-sm mt-1">{errors.mutations[index]?.amount?.message}</p>}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-destructive hover:bg-destructive/10 self-center mt-4 md:mt-0"
                aria-label="Remove mutation"
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ id: crypto.randomUUID(), value: 0, amount: 1, type: "Generic" })}
            className="w-full border-dashed hover:border-solid hover:bg-accent/20"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Mutation
          </Button>
        </div>

        <Button 
          onClick={onSubmitMarketValue} 
          disabled={isEstimatingMarketValue}
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

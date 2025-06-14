
"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppHeader } from "@/components/layout/app-header";
import { ValueInputForm } from "@/components/multiplier/value-input-form";
import { RealTimeCalculationDisplay } from "@/components/multiplier/real-time-calculation";
import { MarketValueEstimator } from "@/components/multiplier/market-value-estimator";
import { FruitsCatalog } from "@/components/multiplier/fruits-catalog";
import { SavedResults } from "@/components/multiplier/saved-results";
import { estimateMarketValue, type EstimateMarketValueInput, type EstimateMarketValueOutput } from "@/ai/flows/estimate-market-value";
import type { CalculationData, CalculationState, SavedCalculation, Mutation } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Save } from "lucide-react";

const mutationSchema = z.object({
  id: z.string(),
  type: z.string().min(1, "Type is required"),
  valueMultiplier: z.preprocess(
    (val) => (String(val).trim() === "" ? NaN : Number(val)),
    z.number({invalid_type_error: "Multiplier must be a number."}).min(0, "Multiplier must be non-negative.")
  ),
});

const calculationFormSchema = z.object({
  fruitBaseValue: z.preprocess(
    (val) => (String(val).trim() === "" ? NaN : Number(val)),
    z.number({invalid_type_error: "Base value must be a number."}).min(0, "Base value must be non-negative.")
  ),
  fruitType: z.string().min(1, "Type is required"),
  mutations: z.array(mutationSchema),
});

const initialCalculationData: CalculationData = {
  fruitBaseValue: 10,
  fruitType: "Apple",
  mutations: [{ id: "initial-mutation-static", type: "Sparkle", valueMultiplier: 1.0 }],
};

export default function FruityMultiplierPage() {
  const { toast } = useToast();
  const [calculationState, setCalculationState] = useState<CalculationState>({
    ...initialCalculationData,
    realTimeTotalValue: initialCalculationData.fruitBaseValue * (initialCalculationData.mutations[0]?.valueMultiplier || 1),
    isLoadingAiEstimate: false,
    aiError: null,
  });
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);

  const formMethods = useForm<CalculationData>({
    resolver: zodResolver(calculationFormSchema),
    defaultValues: initialCalculationData,
    mode: "onChange", // Validate on change to update formState.isValid
  });

  const { control, handleSubmit, watch, reset, formState } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "mutations",
  });

  const watchedFormValues = watch();
  const watchedFormValuesString = JSON.stringify(watchedFormValues);


  useEffect(() => {
    // watchedFormValues contains the raw values from the form, which might be strings for number inputs
    const currentRawValues = JSON.parse(watchedFormValuesString);
    
    const validationResult = calculationFormSchema.safeParse(currentRawValues);

    if (validationResult.success) {
      const validData = validationResult.data;
      let newTotal = validData.fruitBaseValue;
      if (Array.isArray(validData.mutations)) {
        for (const mutation of validData.mutations) {
          newTotal *= mutation.valueMultiplier;
        }
      }
      // Only update if there's an actual change to avoid loops
      if (calculationState.realTimeTotalValue !== newTotal ||
          calculationState.fruitBaseValue !== validData.fruitBaseValue ||
          calculationState.fruitType !== validData.fruitType ||
          JSON.stringify(calculationState.mutations) !== JSON.stringify(validData.mutations)
      ) {
        setCalculationState(prev => ({
          ...prev,
          realTimeTotalValue: newTotal,
          fruitBaseValue: validData.fruitBaseValue,
          fruitType: validData.fruitType,
          mutations: validData.mutations,
        }));
      }
    } else {
      // Form is invalid (e.g., empty number fields result in NaN after preprocess)
      // Update realTimeTotalValue to 0 and reflect raw (potentially string) values in calculationState
      // to keep form inputs populated with what the user typed.
      if (calculationState.realTimeTotalValue !== 0 ||
          calculationState.fruitBaseValue !== (currentRawValues.fruitBaseValue as any) ||
          calculationState.fruitType !== currentRawValues.fruitType ||
          JSON.stringify(calculationState.mutations) !== JSON.stringify(currentRawValues.mutations)
      ) {
        setCalculationState(prev => ({
          ...prev,
          realTimeTotalValue: 0,
          fruitBaseValue: currentRawValues.fruitBaseValue as any, // Keep raw string or number
          fruitType: currentRawValues.fruitType,
          mutations: currentRawValues.mutations.map((m: any) => ({
            id: m.id,
            type: m.type,
            valueMultiplier: m.valueMultiplier as any, // Keep raw string or number
          })),
        }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedFormValuesString]); // Zod schema is stable, formState is implicitly handled by re-render

  useEffect(() => {
    const loaded = localStorage.getItem("fruityMultiplierSaved");
    if (loaded) {
      setSavedCalculations(JSON.parse(loaded));
    }
  }, []);

  const handleEstimateMarketValue = async () => {
    // We rely on formState.isValid being true, so data is already validated
    const currentData = formMethods.getValues(); // Gets validated and transformed values if form is valid

    setCalculationState(prev => ({ ...prev, isLoadingAiEstimate: true, aiError: null }));
    try {
      const input: EstimateMarketValueInput = {
        fruitBaseValue: currentData.fruitBaseValue,
        fruitType: currentData.fruitType,
        mutations: currentData.mutations.map(m => ({ type: m.type, valueMultiplier: m.valueMultiplier })),
      };
      const result = await estimateMarketValue(input);
      setCalculationState(prev => ({ ...prev, aiEstimate: result, isLoadingAiEstimate: false }));
    } catch (error) {
      console.error("AI Estimation Error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setCalculationState(prev => ({ ...prev, aiError: errorMessage, isLoadingAiEstimate: false }));
      toast({
        title: "AI Estimation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const onFormSubmitForEstimate = () => {
    // This function is called by the form's onSubmit, which only fires if RHF validation passes.
    // However, our button is also bound to onSubmitMarketValue, so we call it directly.
    // The button itself is disabled if formState.isValid is false.
    handleEstimateMarketValue();
  };

  const saveCurrentCalculation = () => {
    // Ensure data is valid using the latest form values.
    // formState.isValid should be up-to-date due to mode: "onChange"
    if (!formState.isValid) {
      toast({
        title: "Cannot Save",
        description: "Please ensure all inputs are valid before saving.",
        variant: "destructive",
      });
      // Trigger validation display if not already shown
      handleSubmit(() => {})() 
      return;
    }
    
    const currentDataToSave = formMethods.getValues(); // Gets validated and transformed values
    const newSavedCalculation: SavedCalculation = {
      ...currentDataToSave,
      id: "saved-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9), 
      timestamp: Date.now(),
      realTimeTotalValue: calculationState.realTimeTotalValue, 
    };
    const updatedSaved = [newSavedCalculation, ...savedCalculations].slice(0, 10); 
    setSavedCalculations(updatedSaved);
    localStorage.setItem("fruityMultiplierSaved", JSON.stringify(updatedSaved));
    toast({
      title: "Calculation Saved!",
      description: `${currentDataToSave.fruitType} details have been saved.`,
    });
  };
  
  const loadCalculation = (calculationToLoad: CalculationData) => {
    reset(calculationToLoad); 
    setCalculationState(prev => ({
      ...prev,
      aiEstimate: undefined, 
      aiError: null,
    }));
    toast({
      title: "Calculation Loaded!",
      description: `${calculationToLoad.fruitType} details loaded into the form.`,
    });
  };

  const clearSavedCalculations = () => {
    setSavedCalculations([]);
    localStorage.removeItem("fruityMultiplierSaved");
    toast({
      title: "Saved Calculations Cleared",
    });
  };

  const addMutation = () => {
    append({ 
      id: "mutation-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9), 
      valueMultiplier: 1.1, 
      type: "Generic" 
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
        <Form {...formMethods}>
          <form onSubmit={handleSubmit(onFormSubmitForEstimate)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <section className="lg:col-span-2 space-y-8">
                <ValueInputForm
                  control={control}
                  formState={formState}
                  fieldArray={{ fields, append: addMutation, remove }}
                  onSubmitMarketValue={handleEstimateMarketValue} 
                  isEstimatingMarketValue={calculationState.isLoadingAiEstimate}
                />
                <MarketValueEstimator
                  aiEstimate={calculationState.aiEstimate}
                  isLoading={calculationState.isLoadingAiEstimate}
                  error={calculationState.aiError}
                />
              </section>

              <aside className="space-y-8 lg:sticky lg:top-20"> 
                <RealTimeCalculationDisplay totalValue={calculationState.realTimeTotalValue} />
                 <Button 
                  type="button"
                  onClick={saveCurrentCalculation}
                  className="w-full bg-accent hover:bg-accent/80 text-accent-foreground"
                  size="lg"
                  disabled={!formState.isValid || calculationState.isLoadingAiEstimate} 
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Current Calculation
                </Button>
                <FruitsCatalog />
                <SavedResults 
                  savedCalculations={savedCalculations}
                  onLoadCalculation={loadCalculation}
                  onClearAll={clearSavedCalculations}
                />
              </aside>
            </div>
          </form>
        </Form>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        Fruity Multiplier &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

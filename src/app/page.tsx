
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
  valueMultiplier: z.number().min(0, "Value Multiplier must be non-negative"), // Renamed from factor
});

const calculationFormSchema = z.object({
  fruitBaseValue: z.number().min(0, "Must be non-negative"),
  fruitType: z.string().min(1, "Type is required"),
  mutations: z.array(mutationSchema),
});

const initialCalculationData: CalculationData = {
  fruitBaseValue: 10,
  fruitType: "Apple",
  mutations: [{ id: "initial-mutation-static", type: "Sparkle", valueMultiplier: 0.5 }], // Renamed from factor
};

export default function FruityMultiplierPage() {
  const { toast } = useToast();
  const [calculationState, setCalculationState] = useState<CalculationState>({
    ...initialCalculationData,
    realTimeTotalValue: 0, 
    isLoadingAiEstimate: false,
    aiError: null,
  });
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);

  const formMethods = useForm<CalculationData>({
    resolver: zodResolver(calculationFormSchema),
    defaultValues: initialCalculationData,
    mode: "onChange",
  });

  const { control, handleSubmit, watch, reset, formState } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "mutations",
  });

  const watchedFormValues = watch();
  // Use JSON.stringify for complex dependency to avoid infinite loops.
  const watchedFormValuesString = JSON.stringify(watchedFormValues); 

  useEffect(() => {
    const calculateRealTimeTotal = (data: CalculationData): number => {
      let value = data.fruitBaseValue || 0;
      if (Array.isArray(data.mutations)) {
        data.mutations.forEach(mutation => {
          value *= (1 + (mutation.valueMultiplier || 0)); // Renamed from factor
        });
      }
      return value;
    };
    
    let currentWatchedValues: Partial<CalculationData> = {};
    try {
        // Ensure watchedFormValuesString is valid JSON before parsing
        currentWatchedValues = JSON.parse(watchedFormValuesString);
    } catch (e) {
        console.error("Failed to parse watchedFormValuesString", e);
        // Optionally reset or handle the error state
        setCalculationState(prev => ({ ...prev, realTimeTotalValue: 0 }));
        return;
    }

    // Ensure fruitBaseValue is a number before proceeding
    if (typeof currentWatchedValues.fruitBaseValue === 'number') {
        const dataToValidate: CalculationData = {
            fruitBaseValue: currentWatchedValues.fruitBaseValue,
            fruitType: currentWatchedValues.fruitType ?? '',
            mutations: Array.isArray(currentWatchedValues.mutations) ? currentWatchedValues.mutations.map(m => ({id: m.id || `m-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, type: m.type || '', valueMultiplier: m.valueMultiplier ?? 0})) : [], // Renamed from factor
        };
        const validationResult = calculationFormSchema.safeParse(dataToValidate);

        if (validationResult.success) {
            const validData = validationResult.data;
            const newTotal = calculateRealTimeTotal(validData);
            
            setCalculationState(prev => {
                // More robust check to prevent unnecessary updates
                if (
                    prev.realTimeTotalValue === newTotal &&
                    prev.fruitBaseValue === validData.fruitBaseValue &&
                    prev.fruitType === validData.fruitType &&
                    JSON.stringify(prev.mutations || []) === JSON.stringify(validData.mutations || [])
                ) {
                    return prev; // No change, return previous state
                }
                return { 
                    ...prev, 
                    realTimeTotalValue: newTotal,
                    fruitBaseValue: validData.fruitBaseValue,
                    fruitType: validData.fruitType,
                    mutations: validData.mutations,
                };
            });
        } else {
             // If validation fails, and total is not already 0, reset it.
             setCalculationState(prev => {
                if (prev.realTimeTotalValue !== 0) {
                    return { ...prev, realTimeTotalValue: 0 };
                }
                return prev;
             });
        }
    } else {
        // If fruitBaseValue is not a number (e.g. undefined initially), reset total if not already 0.
        setCalculationState(prev => {
            if (prev.realTimeTotalValue !== 0) {
                return { ...prev, realTimeTotalValue: 0 };
            }
            return prev;
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedFormValuesString]); // Dependency is the stringified version of form values

  useEffect(() => {
    const loaded = localStorage.getItem("fruityMultiplierSaved");
    if (loaded) {
      setSavedCalculations(JSON.parse(loaded));
    }
  }, []);

  const handleEstimateMarketValue = async () => {
    const currentData = watch(); 

    setCalculationState(prev => ({ ...prev, isLoadingAiEstimate: true, aiError: null }));
    try {
      const input: EstimateMarketValueInput = {
        fruitBaseValue: currentData.fruitBaseValue,
        fruitType: currentData.fruitType,
        mutations: currentData.mutations.map(m => ({ type: m.type, valueMultiplier: m.valueMultiplier })), // Renamed from factor
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
    handleEstimateMarketValue();
  };

  const saveCurrentCalculation = () => {
    const validationResult = calculationFormSchema.safeParse(watchedFormValues); 
    if (!validationResult.success) {
      toast({
        title: "Cannot Save",
        description: "Please ensure all inputs are valid before saving.",
        variant: "destructive",
      });
      // Trigger validation display
      handleSubmit(() => {})()
      return;
    }
    
    const currentDataToSave = validationResult.data;
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
      valueMultiplier: 0.1, // Renamed from factor
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

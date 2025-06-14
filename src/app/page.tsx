
"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppHeader } from "@/components/layout/app-header";
import { ValueInputForm, fruitTypes } from "@/components/multiplier/value-input-form";
import { RealTimeCalculationDisplay } from "@/components/multiplier/real-time-calculation";
import { MarketValueEstimator } from "@/components/multiplier/market-value-estimator";
import { FruitsCatalog } from "@/components/multiplier/fruits-catalog";
import { SavedResults } from "@/components/multiplier/saved-results";
import { estimateMarketValue, type EstimateMarketValueInput } from "@/ai/flows/estimate-market-value";
import type { CalculationData, CalculationState, SavedCalculation, GrowthMutationType, Mutation as EnvMutation } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Save } from "lucide-react";
import { ThemeCustomizationModal } from "@/components/settings/theme-customization-modal";

const environmentalMutationSchema = z.object({
  id: z.string(),
  type: z.string().min(1, "Type is required"),
  valueMultiplier: z.number(),
});

const calculationFormSchema = z.object({
  fruitType: z.string().min(1, "Fruit Type is required"),
  basePrice: z.preprocess(
    (val) => (String(val).trim() === "" ? NaN : Number(val)),
    z.number({invalid_type_error: "Base Price must be a number."}).min(0, "Base Price must be non-negative.")
  ),
  massKg: z.preprocess(
    (val) => (String(val).trim() === "" ? NaN : Number(val)),
    z.number({invalid_type_error: "Mass (kg) must be a number."}).min(0, "Mass (kg) must be non-negative.")
  ),
  baseMassKg: z.preprocess(
    (val) => (String(val).trim() === "" ? NaN : Number(val)),
    z.number({invalid_type_error: "Base Mass (kg) must be a number."}).positive("Base Mass (kg) must be positive.")
  ),
  growthMutationType: z.enum(["none", "gold", "rainbow"], {
    errorMap: () => ({ message: "Growth Mutation type is required." }),
  }),
  mutations: z.array(environmentalMutationSchema),
});

const initialEnvironmentalMutation: EnvMutation = { id: "initial-mutation-static", type: "Wet", valueMultiplier: 2.0 };

const defaultFruitType = "Apple";
const defaultFruitData = fruitTypes.find(f => f.value === defaultFruitType) || fruitTypes[0];

const initialCalculationData: CalculationData = {
  fruitType: defaultFruitData.value,
  basePrice: defaultFruitData.basePrice,
  massKg: 1,
  baseMassKg: defaultFruitData.baseMassKg,
  growthMutationType: "none",
  mutations: [initialEnvironmentalMutation],
};

export default function FruityMultiplierPage() {
  const { toast } = useToast();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const calculateTotalValue = (data: CalculationData): number => {
    if (!data) return 0;

    const { basePrice, massKg, baseMassKg, growthMutationType, mutations: environmentalMutations } = data;

    if (isNaN(basePrice) || basePrice < 0 ||
        isNaN(massKg) || massKg < 0 ||
        isNaN(baseMassKg) || baseMassKg <= 0) {
      return 0;
    }

    const massTerm = (massKg >= baseMassKg && baseMassKg > 0) ? (massKg / baseMassKg) ** 2 : 1;

    let growthMultiplierValue = 1;
    if (growthMutationType === "gold") growthMultiplierValue = 20;
    if (growthMutationType === "rainbow") growthMultiplierValue = 50;

    let sumEnvironmentalBonuses = 0;
    if (Array.isArray(environmentalMutations)) {
      environmentalMutations.forEach(mutation => {
        if (typeof mutation.valueMultiplier === 'number' && !isNaN(mutation.valueMultiplier)) {
          sumEnvironmentalBonuses += (mutation.valueMultiplier - 1);
        }
      });
    }
    const numEnvironmentalMutations = Array.isArray(environmentalMutations) ? environmentalMutations.length : 0;
    let environmentalFactor = 1 + sumEnvironmentalBonuses - numEnvironmentalMutations;
    environmentalFactor = Math.max(0, environmentalFactor);

    const totalValue = massTerm * basePrice * growthMultiplierValue * environmentalFactor;
    return isNaN(totalValue) ? 0 : totalValue;
  };

  const [calculationState, setCalculationState] = useState<CalculationState>({
    ...initialCalculationData,
    realTimeTotalValue: calculateTotalValue(initialCalculationData),
    selectedFruitThemeColor: defaultFruitData.themeColor,
    isLoadingAiEstimate: false,
    aiError: null,
  });
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);

  const formMethods = useForm<CalculationData>({
    resolver: zodResolver(calculationFormSchema),
    defaultValues: initialCalculationData,
    mode: "onChange",
  });

  const { control, handleSubmit, watch, reset, formState, getValues } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "mutations",
  });

  const watchedFormValues = watch();
  const watchedFormValuesString = JSON.stringify(watchedFormValues);

  useEffect(() => {
    const currentRawValues = JSON.parse(watchedFormValuesString);
    const validationResult = calculationFormSchema.safeParse(currentRawValues);
    let newSelectedFruitThemeColor = calculationState.selectedFruitThemeColor;

    if (validationResult.success) {
      const validData = validationResult.data;
      const newTotal = calculateTotalValue(validData);
      const selectedFruit = fruitTypes.find(f => f.value === validData.fruitType);
      newSelectedFruitThemeColor = selectedFruit?.themeColor;

      setCalculationState(prev => ({
        ...prev,
        ...validData,
        realTimeTotalValue: newTotal,
        selectedFruitThemeColor: newSelectedFruitThemeColor,
      }));
    } else {
      const partialValidData = {
        fruitType: currentRawValues.fruitType,
        basePrice: currentRawValues.basePrice as any,
        massKg: currentRawValues.massKg as any,
        baseMassKg: currentRawValues.baseMassKg as any,
        growthMutationType: currentRawValues.growthMutationType,
        mutations: (currentRawValues.mutations || []).map((m: any) => ({
          id: m.id,
          type: m.type,
          valueMultiplier: m.valueMultiplier as any,
        })),
      };
      const selectedFruit = fruitTypes.find(f => f.value === partialValidData.fruitType);
      newSelectedFruitThemeColor = selectedFruit?.themeColor;

      setCalculationState(prev => ({
        ...prev,
        ...partialValidData,
        realTimeTotalValue: 0,
        selectedFruitThemeColor: newSelectedFruitThemeColor,
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedFormValuesString]);

  useEffect(() => {
    const loaded = localStorage.getItem("fruityMultiplierSaved");
    if (loaded) {
      setSavedCalculations(JSON.parse(loaded));
    }
  }, []);

  const handleEstimateMarketValue = async () => {
    const currentData = getValues();

    setCalculationState(prev => ({ ...prev, isLoadingAiEstimate: true, aiError: null }));
    try {
      const input: EstimateMarketValueInput = {
        fruitType: currentData.fruitType,
        basePrice: Number(currentData.basePrice),
        massKg: Number(currentData.massKg),
        baseMassKg: Number(currentData.baseMassKg),
        growthMutationType: currentData.growthMutationType,
        environmentalMutations: currentData.mutations.map(m => ({
          type: m.type,
          valueMultiplier: Number(m.valueMultiplier)
        })),
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
    if (!formState.isValid) {
      toast({
        title: "Cannot Save",
        description: "Please ensure all inputs are valid before saving.",
        variant: "destructive",
      });
      handleSubmit(() => {})()
      return;
    }

    const currentDataToSave = getValues();
    const newSavedCalculation: SavedCalculation = {
      ...currentDataToSave,
      basePrice: Number(currentDataToSave.basePrice),
      massKg: Number(currentDataToSave.massKg),
      baseMassKg: Number(currentDataToSave.baseMassKg),
      growthMutationType: currentDataToSave.growthMutationType as GrowthMutationType,
      mutations: currentDataToSave.mutations.map(m => ({
        ...m,
        valueMultiplier: Number(m.valueMultiplier)
      })),
      id: "saved-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      realTimeTotalValue: calculateTotalValue(currentDataToSave),
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
    const selectedFruit = fruitTypes.find(f => f.value === calculationToLoad.fruitType);
    setCalculationState(prev => ({
      ...prev,
      aiEstimate: undefined,
      aiError: null,
      realTimeTotalValue: calculateTotalValue(calculationToLoad),
      selectedFruitThemeColor: selectedFruit?.themeColor
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

  const pageStyle: React.CSSProperties = {};
  if (calculationState.selectedFruitThemeColor) {
    pageStyle.background = `radial-gradient(ellipse at 50% 0%, ${calculationState.selectedFruitThemeColor} 0%, transparent 70%), hsl(var(--background))`;
  }


  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-500" style={pageStyle}>
      <AppHeader onOpenThemeCustomizer={() => setIsThemeModalOpen(true)} />
      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
        <Form {...formMethods}>
          <form onSubmit={handleSubmit(onFormSubmitForEstimate)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <section className="lg:col-span-2 space-y-8">
                <ValueInputForm
                  control={control}
                  fieldArray={{ fields, append, remove }}
                  onSubmitMarketValue={handleEstimateMarketValue}
                  isEstimatingMarketValue={calculationState.isLoadingAiEstimate}
                  formState={formState}
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
        Grow a Garden Value Calculator &copy; {new Date().getFullYear()}
      </footer>
      <ThemeCustomizationModal
        isOpen={isThemeModalOpen}
        onOpenChange={setIsThemeModalOpen}
      />
    </div>
  );
}

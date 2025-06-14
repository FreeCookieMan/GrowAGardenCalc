
"use client";

import type { SavedCalculation, CalculationData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Trash2, UploadCloud } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SavedResultsProps {
  savedCalculations: SavedCalculation[];
  onLoadCalculation: (calculation: CalculationData) => void;
  onClearAll: () => void;
}

export function SavedResults({ savedCalculations, onLoadCalculation, onClearAll }: SavedResultsProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-headline text-xl flex items-center">
            <History className="w-5 h-5 mr-2 text-primary" />
            Saved Calculations
          </CardTitle>
          {savedCalculations.length > 0 && (
             <Button variant="ghost" size="sm" onClick={onClearAll} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4 mr-1" /> Clear All
            </Button>
          )}
        </div>
        <CardDescription>Previously saved calculations for quick access.</CardDescription>
      </CardHeader>
      <CardContent>
        {savedCalculations.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">No saved calculations yet.</p>
        ) : (
          <ScrollArea className="h-[200px] pr-3"> {/* Keep pr-3 for scrollbar space if needed, test this */}
            <ul className="space-y-3">
              {savedCalculations.map((calc) => (
                <li key={calc.id} className="p-3 border rounded-md hover:shadow-sm transition-shadow bg-background/70">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm">{calc.fruitType}</p>
                      <p className="text-xs text-muted-foreground">
                        Base Price: {calc.basePrice}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Mass: {calc.massKg}kg (Base: {calc.baseMassKg}kg)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Growth: {calc.growthMutationType}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Env. Mutations: {calc.mutations.length}
                      </p>
                       <p className="text-xs text-primary font-medium">
                        Total Value: {calc.realTimeTotalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLoadCalculation(calc)}
                      aria-label={`Load calculation for ${calc.fruitType}`}
                      className="bg-accent hover:bg-accent/80 text-accent-foreground"
                    >
                      <UploadCloud className="w-4 h-4 mr-1" /> Load
                    </Button>
                  </div>
                  <Separator className="my-2" />
                   <p className="text-xs text-muted-foreground text-right">
                    Saved: {new Date(calc.timestamp).toLocaleDateString()} {new Date(calc.timestamp).toLocaleTimeString()}
                  </p>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

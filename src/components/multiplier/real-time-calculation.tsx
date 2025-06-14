"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";

interface RealTimeCalculationProps {
  totalValue: number;
}

export function RealTimeCalculationDisplay({ totalValue }: RealTimeCalculationProps) {
  return (
    <Card className="shadow-lg bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Coins className="w-6 h-6 mr-2" />
          Real-time Calculated Value
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-center py-4">
          {totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-center text-primary-foreground/80">
          This is a simple calculation based on your inputs. Use the AI estimator for a market value.
        </p>
      </CardContent>
    </Card>
  );
}

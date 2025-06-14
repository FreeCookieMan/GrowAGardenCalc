"use client";

import type { EstimateMarketValueOutput } from "@/ai/flows/estimate-market-value";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wand2, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketValueEstimatorProps {
  aiEstimate?: EstimateMarketValueOutput;
  isLoading: boolean;
  error?: string | null;
}

export function MarketValueEstimator({ aiEstimate, isLoading, error }: MarketValueEstimatorProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Wand2 className="w-6 h-6 mr-2 text-primary" />
          AI Market Value Estimation
        </CardTitle>
        <CardDescription>
          Get an AI-powered estimation of the fair market value for your item.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}
        {error && !isLoading && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Estimation Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {aiEstimate && !isLoading && !error && (
          <div className="space-y-3">
            <p className="text-3xl font-bold text-primary">
              {aiEstimate.estimatedMarketValue.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) }
            </p>
            <div>
              <h4 className="font-semibold text-muted-foreground">Reasoning:</h4>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{aiEstimate.reasoning}</p>
            </div>
          </div>
        )}
        {!aiEstimate && !isLoading && !error && (
          <p className="text-muted-foreground text-sm">
            Enter item details and click "Estimate Market Value (AI)" to get an estimation.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

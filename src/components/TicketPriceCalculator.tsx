"use client";

import { useState, type FormEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface TicketResult {
  basePrice: number;
  demand: number;
  daysUntilEvent: number;
  finalPrice: number;
  priceIncrease: number;
}

const TICKET_FUNCTION_URL = "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-747ca09c-87f4-4a23-b163-cf1a143ca682/default/dynamic-ticket-pricing";

export function TicketPriceCalculator() {
  const [basePrice, setBasePrice] = useState("100");
  const [demand, setDemand] = useState("1.5");
  const [daysUntilEvent, setDaysUntilEvent] = useState("30");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TicketResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(TICKET_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          basePrice: parseFloat(basePrice),
          demand: parseFloat(demand),
          daysUntilEvent: parseInt(daysUntilEvent, 10),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "An unknown error occurred." }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: TicketResult = await response.json();
      setResult(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(`Failed to fetch: ${e.message}. Please check the function URL and your network.`);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline">Dynamic Ticket Pricing</CardTitle>
        <CardDescription>
          Calculates ticket price based on demand and time.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="basePrice">Base Price ($)</Label>
            <Input
              id="basePrice"
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
              min="0"
              step="0.01"
              placeholder="e.g., 100"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demand">Demand (Multiplier)</Label>
            <Input
              id="demand"
              type="number"
              value={demand}
              onChange={(e) => setDemand(e.target.value)}
              required
              min="0"
              step="0.1"
              placeholder="e.g., 1.5"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daysUntilEvent">Days Until Event</Label>
            <Input
              id="daysUntilEvent"
              type="number"
              value={daysUntilEvent}
              onChange={(e) => setDaysUntilEvent(e.target.value)}
              required
              min="0"
              step="1"
              placeholder="e.g., 30"
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Calculate Ticket Price
          </Button>

          {error && (
            <Alert variant="destructive" className="w-full">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="w-full rounded-md border bg-muted/50 p-4 text-sm">
                <h3 className="font-semibold mb-2 text-foreground">Calculation Result:</h3>
                <div className="space-y-1 text-muted-foreground">
                    <p>Base Price: <span className="font-mono float-right text-foreground">${result.basePrice.toFixed(2)}</span></p>
                    <p>Demand Multiplier: <span className="font-mono float-right text-foreground">{result.demand}</span></p>
                    <p>Days Until Event: <span className="font-mono float-right text-foreground">{result.daysUntilEvent}</span></p>
                    <p>Price Increase: <span className="font-mono float-right text-[hsl(var(--chart-2))]">${result.priceIncrease.toFixed(2)}</span></p>
                    <Separator className="my-2" />
                    <p className="font-bold text-foreground">Final Price: <span className="font-mono float-right">${result.finalPrice.toFixed(2)}</span></p>
                </div>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}

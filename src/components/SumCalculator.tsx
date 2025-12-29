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
import { Loader2 } from "lucide-react";

interface SumResult {
  sum: number;
}

const SUM_FUNCTION_URL = "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-a256fcb2-9e54-4419-8533-b3d62dcce";

export function SumCalculator() {
  const [num1, setNum1] = useState("10");
  const [num2, setNum2] = useState("20");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SumResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(SUM_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          num1: parseFloat(num1),
          num2: parseFloat(num2),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "An unknown error occurred." }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: SumResult = await response.json();
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
        <CardTitle className="font-headline">Sum Function</CardTitle>
        <CardDescription>
          Calculates the sum of two numbers.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="num1">Number 1</Label>
            <Input
              id="num1"
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              required
              placeholder="e.g., 10"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="num2">Number 2</Label>
            <Input
              id="num2"
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              required
              placeholder="e.g., 20"
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Calculate Sum
          </Button>

          {error && (
            <Alert variant="destructive" className="w-full">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result !== null && (
            <div className="w-full rounded-md border bg-muted/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">Sum</p>
                <p className="text-3xl font-bold font-mono text-primary">{result.sum}</p>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}

import { TicketPriceCalculator } from "@/components/TicketPriceCalculator";
import { SumCalculator } from "@/components/SumCalculator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-md space-y-8">
        <header className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Function Runner
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            A tool for a university lab on serverless functions.
          </p>
        </header>

        <TicketPriceCalculator />
        <SumCalculator />

        <footer className="pt-4 text-center text-sm text-muted-foreground">
          <p>Built for the "Deploying Serverless Functions and Full-Stack Application" lab.</p>
        </footer>
      </div>
    </main>
  );
}

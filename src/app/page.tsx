import Link from "next/link";
import { redirect } from "next/navigation";
import { Wallet, TrendingDown, PieChart, Shield } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Wallet className="h-6 w-6 mr-2" />
          <span className="font-bold">Spendthrift</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild variant="ghost">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Track Your Expenses with Ease
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Take control of your finances. Simple, powerful expense
                  tracking to help you understand where your money goes.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-background rounded-full">
                  <TrendingDown className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold">Track Spending</h3>
                <p className="text-muted-foreground">
                  Monitor every expense and see where your money goes
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-background rounded-full">
                  <PieChart className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold">Categorize</h3>
                <p className="text-muted-foreground">
                  Organize expenses into custom categories for better insights
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-background rounded-full">
                  <Shield className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold">Secure</h3>
                <p className="text-muted-foreground">
                  Your financial data is encrypted and protected
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2026 Spendthrift. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

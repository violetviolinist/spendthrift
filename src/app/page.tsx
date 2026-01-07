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
    <div className="flex flex-col min-h-screen bg-background">
      <header className="h-16 border-b bg-card">
        <div className="container flex h-full items-center justify-between">
          <Link className="flex items-center gap-2" href="/">
            <div className="p-1.5 bg-primary rounded-lg">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Spendthrift</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="flex flex-col items-center gap-6 text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl max-w-3xl">
                Track Your Expenses with Ease
              </h1>
              <p className="max-w-[600px] text-muted-foreground text-lg">
                Take control of your finances. Simple, powerful expense
                tracking to help you understand where your money goes.
              </p>
              <div className="flex gap-4">
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
        <section className="py-20 bg-muted">
          <div className="container">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 bg-background rounded-full">
                  <TrendingDown className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Track Spending</h3>
                <p className="text-muted-foreground">
                  Monitor every expense and see where your money goes
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 bg-background rounded-full">
                  <PieChart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Categorize</h3>
                <p className="text-muted-foreground">
                  Organize expenses into custom categories for better insights
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 bg-background rounded-full">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Secure</h3>
                <p className="text-muted-foreground">
                  Your financial data is encrypted and protected
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container">
          <p className="text-sm text-muted-foreground text-center">
            © 2026 Spendthrift. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

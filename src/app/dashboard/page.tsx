import Link from "next/link";
import { ArrowRight, DollarSign, Receipt, TrendingUp } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { getExpensesByUserId } from "@/db/queries/expenses";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExpenseList } from "@/components/expenses/expense-list";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const expenses = await getExpensesByUserId(user.id);

  // Calculate stats
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthExpenses = expenses.filter(
    (e) => new Date(e.date) >= firstDayOfMonth
  );

  const totalThisMonth = thisMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const totalCount = expenses.length;
  const recentExpenses = expenses.slice(0, 5);

  // Most used category
  const categoryCount = expenses.reduce(
    (acc, e) => {
      if (e.category) {
        acc[e.category.name] = (acc[e.category.name] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );
  const mostUsedCategory = Object.entries(categoryCount).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0];

  return (
    <div className="flex flex-col gap-8 animate-slide-in">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-base sm:text-lg text-muted-foreground mt-1">
          Welcome back, {user.name || user.email}!
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalThisMonth)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {thisMonthExpenses.length} expenses recorded
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Receipt className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Category
            </CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mostUsedCategory || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {mostUsedCategory
                ? `${categoryCount[mostUsedCategory]} times`
                : "No expenses yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Recent Expenses</CardTitle>
            <CardDescription className="mt-1">
              Your latest 5 expenses
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/expenses">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentExpenses.length > 0 ? (
            <ExpenseList expenses={recentExpenses} />
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Receipt className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No expenses yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Start tracking your expenses to see them here
              </p>
              <Button asChild>
                <Link href="/dashboard/expenses">Create Your First Expense</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

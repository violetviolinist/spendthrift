"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { toast } from "sonner";
import type { CreateExpenseInput } from "@/lib/validations/expense";

export default function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [expense, setExpense] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [expenseRes, categoriesRes] = await Promise.all([
        fetch(`/api/expenses/${id}`),
        fetch("/api/categories"),
      ]);

      if (expenseRes.ok) {
        const data = await expenseRes.json();
        setExpense(data.expense);
      } else {
        toast.error("Expense not found");
        router.push("/dashboard/expenses");
        return;
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data.categories);
      }
    } catch (error) {
      toast.error("Failed to load expense");
      router.push("/dashboard/expenses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: CreateExpenseInput) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update expense");
      }

      toast.success("Expense updated successfully");
      router.push("/dashboard/expenses");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update expense"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse bg-muted rounded" />
        <Card>
          <CardHeader>
            <div className="h-6 w-32 animate-pulse bg-muted rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse bg-muted rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!expense) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/expenses")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Expenses
        </Button>
        <h1 className="text-3xl font-bold">Edit Expense</h1>
        <p className="text-muted-foreground">Update your expense details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>Make changes to your expense</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseForm
            initialData={{
              amount: expense.amount,
              description: expense.description,
              categoryId: expense.categoryId,
              date: new Date(expense.date),
            }}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/dashboard/expenses")}
            isLoading={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}

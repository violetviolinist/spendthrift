"use client";

import { Receipt } from "lucide-react";
import { ExpenseListItem } from "./expense-list-item";

interface ExpenseListProps {
  expenses: Array<{
    id: string;
    amount: number;
    description: string;
    date: Date;
    category?: {
      id: string;
      name: string;
      color?: string | null;
      icon?: string | null;
    } | null;
  }>;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export function ExpenseList({
  expenses,
  onEdit,
  onDelete,
  isLoading = false,
}: ExpenseListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
          <Receipt className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No expenses found</h3>
        <p className="text-sm text-muted-foreground">
          Create your first expense to start tracking your spending
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {expenses.map((expense) => (
        <ExpenseListItem
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

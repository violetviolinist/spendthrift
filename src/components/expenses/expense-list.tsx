"use client";

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
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
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
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-28 border-2 rounded-xl bg-gradient-to-r from-muted/50 to-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6 animate-pulse">
          <svg
            className="w-10 h-10 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No expenses found</h3>
        <p className="text-base text-muted-foreground">
          Create your first expense to start tracking your spending
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
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

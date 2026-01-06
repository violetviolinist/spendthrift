"use client";

import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExpenseListItemProps {
  expense: {
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
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ExpenseListItem({
  expense,
  onEdit,
  onDelete,
}: ExpenseListItemProps) {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-card border border-border rounded-xl hover:shadow-md hover:border-primary/30 transition-all duration-200 animate-slide-in gap-4">
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground tabular-nums">
            {formatDate(expense.date)}
          </span>
          {expense.category && (
            <Badge
              variant="secondary"
              className="font-medium shadow-sm"
              style={
                expense.category.color
                  ? {
                      backgroundColor: expense.category.color + "15",
                      color: expense.category.color,
                      borderColor: expense.category.color + "30",
                      borderWidth: "1px",
                    }
                  : undefined
              }
            >
              {expense.category.icon && (
                <span className="mr-1.5 text-base">{expense.category.icon}</span>
              )}
              {expense.category.name}
            </Badge>
          )}
        </div>
        <p className="font-semibold text-foreground text-base truncate">
          {expense.description}
        </p>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-4">
        <span className="text-xl font-bold text-foreground tabular-nums">
          {formatCurrency(expense.amount)}
        </span>
        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(expense.id)}
            className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(expense.id)}
            className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

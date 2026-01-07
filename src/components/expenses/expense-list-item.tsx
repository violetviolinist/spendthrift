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
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ExpenseListItem({
  expense,
  onEdit,
  onDelete,
}: ExpenseListItemProps) {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card border rounded-lg hover:shadow-sm transition-all gap-3">
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">
            {formatDate(expense.date)}
          </span>
          {expense.category && (
            <Badge
              variant="secondary"
              style={
                expense.category.color
                  ? {
                      backgroundColor: expense.category.color + "15",
                      color: expense.category.color,
                    }
                  : undefined
              }
            >
              {expense.category.icon && (
                <span className="mr-1">{expense.category.icon}</span>
              )}
              {expense.category.name}
            </Badge>
          )}
        </div>
        <p className="font-medium text-foreground truncate">
          {expense.description}
        </p>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-3">
        <span className="text-lg font-semibold text-foreground">
          {formatCurrency(expense.amount)}
        </span>
        {(onEdit || onDelete) && (
          <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(expense.id)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            )}
            {onDelete && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(expense.id)}
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { Pencil, Trash2, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "./category-badge";

interface CategoryListProps {
  categories: Array<{
    id: string;
    name: string;
    color?: string | null;
    icon?: string | null;
    userId?: string | null;
  }>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function CategoryList({
  categories,
  onEdit,
  onDelete,
  isLoading = false,
}: CategoryListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
          <Tags className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No categories found</h3>
        <p className="text-sm text-muted-foreground">
          Create categories to organize your expenses
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="group flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-sm transition-all"
        >
          <CategoryBadge category={category} />
          {category.userId && (
            <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(category.id)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(category.id)}
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

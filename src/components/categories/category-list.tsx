"use client";

import { Pencil, Trash2 } from "lucide-react";
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-20 border-2 rounded-xl bg-gradient-to-r from-muted/50 to-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
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
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No categories found</h3>
        <p className="text-base text-muted-foreground">
          Create categories to organize your expenses
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="group flex items-center justify-between p-5 border-2 rounded-xl bg-card hover:shadow-md hover:border-primary/30 transition-all duration-200 animate-slide-in"
        >
          <CategoryBadge category={category} className="text-lg" />
          {category.userId && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(category.id)}
                className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(category.id)}
                className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
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

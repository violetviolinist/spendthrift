"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCategorySchema,
  type CreateCategoryInput,
} from "@/lib/validations/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategoryFormProps {
  initialData?: {
    name: string;
    color?: string | null;
    icon?: string | null;
  };
  onSubmit: (data: CreateCategoryInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          color: initialData.color || undefined,
          icon: initialData.icon || undefined,
        }
      : {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Category name"
          {...register("name")}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon (emoji)</Label>
        <Input
          id="icon"
          placeholder="🏠"
          maxLength={2}
          {...register("icon")}
          disabled={isLoading}
        />
        {errors.icon && (
          <p className="text-sm text-destructive">{errors.icon.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <div className="flex gap-2">
          <Input
            id="color"
            type="color"
            {...register("color")}
            disabled={isLoading}
            className="w-20 h-10"
          />
          <Input
            placeholder="#000000"
            {...register("color")}
            disabled={isLoading}
          />
        </div>
        {errors.color && (
          <p className="text-sm text-destructive">{errors.color.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}

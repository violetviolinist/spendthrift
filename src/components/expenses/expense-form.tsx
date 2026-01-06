"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  createExpenseSchema,
  type CreateExpenseInput,
} from "@/lib/validations/expense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface ExpenseFormProps {
  initialData?: {
    amount: number;
    description: string;
    categoryId?: string | null;
    date: Date;
  };
  categories: Array<{
    id: string;
    name: string;
    color?: string | null;
    icon?: string | null;
  }>;
  onSubmit: (data: CreateExpenseInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ExpenseForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateExpenseInput>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: initialData
      ? {
          amount: initialData.amount,
          description: initialData.description,
          categoryId: initialData.categoryId || undefined,
          date: initialData.date,
        }
      : {
          date: new Date(),
        },
  });

  const selectedDate = watch("date");
  const selectedCategoryId = watch("categoryId");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-base font-semibold">
          Amount
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
            $
          </span>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            className="pl-8 text-lg h-12"
            {...register("amount", { valueAsNumber: true })}
            disabled={isLoading}
          />
        </div>
        {errors.amount && (
          <p className="text-sm font-medium text-destructive flex items-center gap-1">
            {errors.amount.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-semibold">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="What did you spend on?"
          className="min-h-[100px] resize-none"
          {...register("description")}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm font-medium text-destructive flex items-center gap-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId" className="text-base font-semibold">
          Category (optional)
        </Label>
        <Select
          value={selectedCategoryId || ""}
          onValueChange={(value) => setValue("categoryId", value || null)}
          disabled={isLoading}
        >
          <SelectTrigger id="categoryId" className="h-12">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <span className="flex items-center gap-2">
                  {category.icon && <span className="text-lg">{category.icon}</span>}
                  <span className="font-medium">{category.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-sm font-medium text-destructive flex items-center gap-1">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-medium h-12",
                !selectedDate && "text-muted-foreground"
              )}
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              {selectedDate ? (
                format(
                  typeof selectedDate === "string"
                    ? new Date(selectedDate)
                    : selectedDate,
                  "PPP"
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={
                selectedDate
                  ? typeof selectedDate === "string"
                    ? new Date(selectedDate)
                    : selectedDate
                  : undefined
              }
              onSelect={(date) => setValue("date", date || new Date())}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm font-medium text-destructive flex items-center gap-1">
            {errors.date.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            size="lg"
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading} size="lg" className="min-w-[120px]">
          {isLoading ? "Saving..." : initialData ? "Update Expense" : "Create Expense"}
        </Button>
      </div>
    </form>
  );
}

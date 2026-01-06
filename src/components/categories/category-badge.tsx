import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: {
    name: string;
    color?: string | null;
    icon?: string | null;
  };
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("font-medium", className)}
      style={
        category.color
          ? {
              backgroundColor: category.color + "20",
              color: category.color,
              borderColor: category.color,
            }
          : undefined
      }
    >
      {category.icon && <span className="mr-1.5">{category.icon}</span>}
      {category.name}
    </Badge>
  );
}

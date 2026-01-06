import { db } from "./index";
import { categories } from "./schema";

const defaultCategories = [
  {
    name: "Food & Dining",
    color: "#ef4444",
    icon: "🍔",
    userId: null,
  },
  {
    name: "Transportation",
    color: "#3b82f6",
    icon: "🚗",
    userId: null,
  },
  {
    name: "Shopping",
    color: "#8b5cf6",
    icon: "🛍️",
    userId: null,
  },
  {
    name: "Entertainment",
    color: "#ec4899",
    icon: "🎬",
    userId: null,
  },
  {
    name: "Bills & Utilities",
    color: "#f59e0b",
    icon: "💡",
    userId: null,
  },
  {
    name: "Healthcare",
    color: "#10b981",
    icon: "🏥",
    userId: null,
  },
  {
    name: "Other",
    color: "#6b7280",
    icon: "📦",
    userId: null,
  },
];

async function seed() {
  console.log("Seeding database...");

  try {
    // Insert default categories
    for (const category of defaultCategories) {
      await db.insert(categories).values(category);
      console.log(`✓ Created category: ${category.name}`);
    }

    console.log("\n✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();

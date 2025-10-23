import { getCategoriesWithCount } from "@/lib/blog";
import { NavigationClient } from "./NavigationClient";

export async function Navigation() {
  try {
    const categories = await getCategoriesWithCount();
    return <NavigationClient categories={categories} />;
  } catch (error) {
    console.error("Failed to load categories for navigation:", error);
    // Fallback to empty categories
    return <NavigationClient categories={[]} />;
  }
}

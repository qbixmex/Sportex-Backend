import { Category } from "../entities/category.entity.ts";

export type FetchCategoryResponse = {
  message?: string;
  category: Category | null;
};

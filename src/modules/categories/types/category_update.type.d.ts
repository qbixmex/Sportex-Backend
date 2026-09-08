import { Category } from "../entities/category.entity.ts";

export type UpdateCategoryResponse = {
  message: string;
  category: Category | null;
};

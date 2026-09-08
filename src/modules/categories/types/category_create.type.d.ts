import { Category } from "../entities/category.entity.ts";

export type CreateCategoryResponse = {
  message: string;
  category: Category | null;
};

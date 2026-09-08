import { Pagination } from "../../common/types/pagination.type.js";

export type ResponseCategoriesList = {
  message?: string;
  categories: CATEGORY_TYPE[];
  pagination: Pagination | null;
};

export type CATEGORY_TYPE = {
  id: string;
  name: string;
  permalink?: string;
};
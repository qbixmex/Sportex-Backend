import { Pagination } from "../../common/types/pagination.type.js";

export type TOURNAMENT_TYPE = {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | undefined;
  stage: string | undefined;
  season: string | undefined;
  startDate: Date;
  endDate: Date;
  active: boolean | undefined;
  categoriesQuantity: number;
};

export type ResponseTournamentList = {
  message?: string;
  tournaments: TOURNAMENT_TYPE[];
  pagination: Pagination | null;
};

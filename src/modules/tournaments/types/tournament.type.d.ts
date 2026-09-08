type Tournament = {
  id: string;
  name: string;
  imageUrl?: string;
  imagePublicId?: string;
  permalink: string;
  description?: string;
  country?: string;
  city?: string;
  season?: string;
  startDate: Date;
  endDate: Date;
  active?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  categories: Category[];
  teamsQuantity: number;
};

type Category = {
  id: string;
  name: string;
  permalink: string;
};

export type FetchTournamentResponse = {
  message?: string;
  tournament?: Tournament;
};

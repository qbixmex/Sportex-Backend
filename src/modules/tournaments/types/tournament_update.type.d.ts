import { Tournament } from "../entities/Tournament.entity.ts";

export type UpdateTournamentResponse = {
  message: string;
  tournament: Tournament | null;
};

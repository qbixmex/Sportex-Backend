import { Tournament } from "../entities/tournament.entity.ts";

export type CreateTournamentResponse = {
  message: string;
  tournament: Tournament | null;
};

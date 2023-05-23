import { MixedHarvest } from 'src/harvest/models/mixed-harvest';

export interface HarvestUser {
  nickname: string;
  discord: string;
  server: string;
}

export interface HarvestResponse {
  harvest: MixedHarvest[];
  harvestId: string;
  user: HarvestUser;
}

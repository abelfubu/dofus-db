import { HarvestItem } from '@prisma/client';

export interface ExchangeResponse {
  picture: string;
  nickname: string;
  discord: string;
  server: string;
  userHarvestId: string;
  harvest: ExchangeHarvest;
}

export interface ExchangeHarvest {
  0: HarvestItem[];
  1: HarvestItem[];
  2: HarvestItem[];
}

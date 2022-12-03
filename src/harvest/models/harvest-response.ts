import { Harvest } from '@prisma/client';

export interface HarvestResponse {
  harvest: Harvest[];
  harvestId: string;
}

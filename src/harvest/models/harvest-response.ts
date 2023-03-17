import { MixedHarvest } from 'src/harvest/models/mixed-harvest';

export interface HarvestResponse {
  harvest: MixedHarvest[];
  harvestId: string;
}

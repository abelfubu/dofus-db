import { Harvest, HarvestItem } from '@prisma/client';

export type MixedHarvest = Harvest & HarvestItem;

import { IsObject } from 'class-validator';

export class HarvestCompleteStepsDto {
  @IsObject()
  steps: Record<number, boolean>;
}

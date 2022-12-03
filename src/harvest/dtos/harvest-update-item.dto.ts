import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class HarvestUpdateItemDto {
  @IsString()
  id: string;

  @IsString()
  harvestId: string;

  @IsBoolean()
  captured: boolean;

  @IsNumber()
  amount: number;
}

import { IsString } from 'class-validator';

export class ProfileUpdateDto {
  @IsString()
  id: string;

  @IsString()
  serverId: string;

  @IsString()
  discord?: string;

  @IsString()
  nickname: string;
}

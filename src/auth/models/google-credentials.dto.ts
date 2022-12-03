import { IsString } from 'class-validator';

export class GoogleCredentialsDto {
  @IsString()
  credential: string;
}

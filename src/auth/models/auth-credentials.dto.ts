import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsEmail({ unique: true })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is weak',
  })
  password: string;

  discord?: string;

  server?: string;
}

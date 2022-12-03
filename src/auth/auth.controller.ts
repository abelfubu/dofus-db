import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { AuthCredentialsDto } from './models/auth-credentials.dto';
import { AuthService } from './auth.service';
import { GetUser } from './get-user.decorator';
import { JwtResponse } from './models/jwt-response';
import { GoogleCredentialsDto } from './models/google-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/email')
  async signInWithEmail(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<JwtResponse> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/google')
  async signInWithGoogle(
    @Body() googleCredentials: GoogleCredentialsDto,
  ): Promise<JwtResponse> {
    return this.authService.signInWithGoogle(googleCredentials);
  }

  @Get('/secret')
  @UseGuards(AuthGuard())
  async secret(@GetUser() user: User): Promise<string> {
    return user.email;
  }
}

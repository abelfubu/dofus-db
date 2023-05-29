import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GetUser } from './get-user.decorator';
import { AuthCredentialsDto } from './models/auth-credentials.dto';
import { GoogleCredentialsDto } from './models/google-credentials.dto';
import { JwtResponse } from './models/jwt-response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/email')
  async signInWithEmail(
    @Res() response: Response,
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<JwtResponse> {
    const jwtResponse = await this.authService.signIn(authCredentialsDto);

    response.cookie('token', jwtResponse.accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7 * 4 * 36,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return jwtResponse;
  }

  @Post('/google')
  async signInWithGoogle(
    @Res({ passthrough: true }) response: Response,
    @Body() googleCredentials: GoogleCredentialsDto,
  ): Promise<JwtResponse> {
    const jwtResponse = await this.authService.signInWithGoogle(
      googleCredentials,
    );

    response.cookie('token', jwtResponse.accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7 * 4 * 36,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return jwtResponse;
  }

  @Get('/secret')
  @UseGuards(AuthGuard())
  async secret(@GetUser() user: User): Promise<string> {
    return user.email;
  }
}

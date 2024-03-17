import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new me' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The me has been successfully signed up.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Credentials taken',
  })
  @ApiBody({ type: SignUpDto })
  async signup(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.signup(dto);
    return this.authService.setAccessTokenCookie(res, access_token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOperation({ summary: 'Sign in an existing me' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The me has been successfully signed in.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiBody({ type: SignInDto })
  async signin(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.signin(dto);
    return this.authService.setAccessTokenCookie(res, access_token);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Log out the current me' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The me has been successfully logged out.',
  })
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.invalidateAccessTokenCookie(res);
  }
}

// FILE: backend/src/auth/auth.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: HTTP auth routes for MAX, Telegram, and demo organizer login.
//   SCOPE: POST max-login, telegram-login, demo-organizer-login
//   DEPENDS: M-AUTH
//   LINKS: M-AUTH, V-M-AUTH
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   AuthController - messenger and demo login routes
//   loginWithMax - MAX Mini App initData login
//   loginWithTelegram - Telegram Mini App initData login
//   loginAsDemoOrganizer - seeded organizer JWT
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { MaxAuthDto } from './dto/max-auth.dto';
import { TelegramAuthDto } from './dto/telegram-auth.dto';

// START_CONTRACT: AuthController
//   PURPOSE: Expose login endpoints that return an internal JWT.
//   INPUTS: { authService: AuthService }
//   OUTPUTS: { POST routes -> { accessToken } }
//   SIDE_EFFECTS: may upsert users via AuthService
//   LINKS: M-AUTH, V-M-AUTH
// END_CONTRACT: AuthController
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // START_BLOCK_LOGIN_ROUTES
  @Post('max-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login or Register via MAX Mini App' })
  @ApiResponse({ status: 200, description: 'Returns internal JWT token.' })
  @ApiResponse({ status: 401, description: 'Invalid hash.' })
  loginWithMax(@Body() dto: MaxAuthDto) {
    return this.authService.loginWithMax(dto);
  }

  @Post('telegram-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login or Register via Telegram Mini App' })
  @ApiResponse({ status: 200, description: 'Returns internal JWT token.' })
  @ApiResponse({ status: 401, description: 'Invalid hash.' })
  loginWithTelegram(@Body() dto: TelegramAuthDto) {
    return this.authService.loginWithTelegram(dto);
  }

  @Post('demo-organizer-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login as a demo organization user' })
  @ApiResponse({ status: 200, description: 'Returns internal JWT token for the demo organizer.' })
  loginAsDemoOrganizer() {
    return this.authService.loginAsDemoOrganizer();
  }
  // END_BLOCK_LOGIN_ROUTES
}

import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { MaxAuthDto } from './dto/max-auth.dto';
import { TelegramAuthDto } from './dto/telegram-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
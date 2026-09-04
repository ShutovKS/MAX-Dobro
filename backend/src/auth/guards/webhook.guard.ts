// FILE: backend/src/auth/guards/webhook.guard.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Require the Supabase webhook Bearer secret on webhook routes.
//   SCOPE: Bearer extraction and equality check against SUPABASE_WEBHOOK_SECRET
//   DEPENDS: none
//   LINKS: M-AUTH, V-M-AUTH, M-WEBHOOKS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   WebhookGuard - webhook secret CanActivate
//   canActivate - compare Bearer token to env secret
//   extractTokenFromHeader - Bearer token parser
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// START_CONTRACT: WebhookGuard
//   PURPOSE: Reject webhook requests that lack the configured secret.
//   INPUTS: { context: ExecutionContext - Authorization Bearer token }
//   OUTPUTS: { boolean - true when secret matches }
//   SIDE_EFFECTS: throws UnauthorizedException on mismatch
//   LINKS: M-AUTH, V-M-AUTH, M-WEBHOOKS
// END_CONTRACT: WebhookGuard
@Injectable()
export class WebhookGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  // START_BLOCK_CAN_ACTIVATE
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const webhookSecret = this.configService.getOrThrow<string>(
      'SUPABASE_WEBHOOK_SECRET',
    );

    if (token !== webhookSecret) {
      throw new UnauthorizedException('Invalid webhook secret');
    }

    return true;
  }
  // END_BLOCK_CAN_ACTIVATE

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

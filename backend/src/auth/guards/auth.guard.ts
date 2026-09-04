// FILE: backend/src/auth/guards/auth.guard.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Require a valid internal JWT or Supabase session token on protected routes.
//   SCOPE: Bearer extraction, internal jwt.verify, Supabase getUser fallback, request.user attach
//   DEPENDS: M-SUPABASE, M-PRISMA
//   LINKS: M-AUTH, V-M-AUTH, M-SUPABASE, M-PRISMA
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   AuthGuard - dual-token CanActivate guard
//   canActivate - verify internal JWT then Supabase token
//   extractTokenFromHeader - Bearer token parser
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';

// START_CONTRACT: AuthGuard
//   PURPOSE: Accept internal JWT or Supabase session tokens for protected API routes.
//   INPUTS: { context: ExecutionContext - Authorization Bearer token }
//   OUTPUTS: { boolean - true when request.user is set }
//   SIDE_EFFECTS: attaches Prisma User to request; throws UnauthorizedException
//   LINKS: M-AUTH, V-M-AUTH, M-SUPABASE, M-PRISMA
// END_CONTRACT: AuthGuard
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtSecret: string;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.getOrThrow<string>('JWT_INTERNAL_SECRET');
  }

  // START_BLOCK_CAN_ACTIVATE
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = jwt.verify(token, this.jwtSecret) as any;
      if (payload.type === 'internal' && payload.sub) {
        const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user) throw new Error('User not found');
        request['user'] = user;
        return true;
      }
    } catch (internalError) {
      try {
        const { data: { user: supabaseUser }, error } = await this.supabaseService.client.auth.getUser(token);
        if (error || !supabaseUser) throw new UnauthorizedException('Invalid Supabase token');
        
        const user = await this.prisma.user.findUnique({ where: { supabaseUserId: supabaseUser.id } });
        if (!user) throw new UnauthorizedException('User not found for Supabase token');
        
        request['user'] = user;
        return true;
      } catch (supabaseError) {
        throw new UnauthorizedException(supabaseError.message || 'Invalid token');
      }
    }
    
    throw new UnauthorizedException('Unsupported token type');
  }
  // END_BLOCK_CAN_ACTIVATE

  protected extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

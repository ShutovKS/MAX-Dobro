import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';

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

  protected extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
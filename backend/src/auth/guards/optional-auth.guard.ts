import { Injectable } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Injectable()
export class OptionalAuthGuard extends AuthGuard {
  override async canActivate(context: any): Promise<boolean> {
    try {
      return await super.canActivate(context);
    } catch (error) {
      const request = context.switchToHttp().getRequest();
      if (!this.extractTokenFromHeader(request)) {
        return true;
      }
      throw error;
    }
  }
}
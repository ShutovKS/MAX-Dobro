// FILE: backend/src/auth/guards/optional-auth.guard.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: AuthGuard variant that allows missing tokens while still rejecting invalid ones.
//   SCOPE: override canActivate to pass through when no Bearer token is present
//   DEPENDS: M-AUTH
//   LINKS: M-AUTH, V-M-AUTH
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   OptionalAuthGuard - optional authentication CanActivate
//   canActivate - super.canActivate or true when token absent
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Injectable } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

// START_CONTRACT: OptionalAuthGuard
//   PURPOSE: Authenticate when a token is present; allow anonymous when it is not.
//   INPUTS: { context: ExecutionContext }
//   OUTPUTS: { boolean - true for anonymous or valid token }
//   SIDE_EFFECTS: may attach request.user; rethrows invalid-token errors
//   LINKS: M-AUTH, V-M-AUTH
// END_CONTRACT: OptionalAuthGuard
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

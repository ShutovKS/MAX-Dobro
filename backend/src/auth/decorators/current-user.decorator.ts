// FILE: backend/src/auth/decorators/current-user.decorator.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Param decorator that reads the User attached by AuthGuard.
//   SCOPE: createParamDecorator over HTTP request.user
//   DEPENDS: M-AUTH
//   LINKS: M-AUTH, V-M-AUTH
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   CurrentUser - request.user param decorator
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

// START_CONTRACT: CurrentUser
//   PURPOSE: Inject the authenticated Prisma User from the request.
//   INPUTS: { data: unknown, ctx: ExecutionContext }
//   OUTPUTS: { User - request.user }
//   SIDE_EFFECTS: none
//   LINKS: M-AUTH, V-M-AUTH
// END_CONTRACT: CurrentUser
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

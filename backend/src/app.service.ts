// FILE: backend/src/app.service.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Root application service that returns the hello payload.
//   SCOPE: getHello string response
//   DEPENDS: none
//   LINKS: M-BACKEND-APP, V-M-BACKEND-APP
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   AppService - root hello service
//   getHello - returns Hello World string
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Injectable } from '@nestjs/common';

// START_CONTRACT: AppService
//   PURPOSE: Provide the root hello string used by AppController.
//   INPUTS: { none }
//   OUTPUTS: { getHello -> string }
//   SIDE_EFFECTS: none
//   LINKS: M-BACKEND-APP, V-M-BACKEND-APP
// END_CONTRACT: AppService
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

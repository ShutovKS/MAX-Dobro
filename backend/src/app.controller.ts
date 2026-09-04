// FILE: backend/src/app.controller.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Minimal root HTTP controller for the backend health/hello route.
//   SCOPE: GET / via AppService.getHello
//   DEPENDS: M-BACKEND-APP
//   LINKS: M-BACKEND-APP, V-M-BACKEND-APP
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   AppController - root GET handler
//   getHello - returns AppService hello string
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// START_CONTRACT: AppController
//   PURPOSE: Expose the backend root route.
//   INPUTS: { appService: AppService }
//   OUTPUTS: { GET / -> string }
//   SIDE_EFFECTS: none
//   LINKS: M-BACKEND-APP, V-M-BACKEND-APP
// END_CONTRACT: AppController
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // START_BLOCK_GET_HELLO
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // END_BLOCK_GET_HELLO
}

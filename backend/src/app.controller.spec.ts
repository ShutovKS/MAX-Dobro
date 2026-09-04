// FILE: backend/src/app.controller.spec.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Unit test for the root AppController hello route.
//   SCOPE: TestingModule wiring of AppController and AppService; GET hello assertion
//   DEPENDS: M-BACKEND-APP
//   LINKS: M-BACKEND-APP, V-M-BACKEND-APP
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   describe AppController - testing module fixture and root hello assertion
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  // START_BLOCK_TEST_MODULE_SETUP
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });
  // END_BLOCK_TEST_MODULE_SETUP

  // START_BLOCK_ROOT_HELLO_ASSERTION
  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
  // END_BLOCK_ROOT_HELLO_ASSERTION
});

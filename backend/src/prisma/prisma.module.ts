// FILE: backend/src/prisma/prisma.module.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Global Nest module that provides and exports PrismaService.
//   SCOPE: PrismaService provider registration and export
//   DEPENDS: M-PRISMA
//   LINKS: M-PRISMA, V-M-PRISMA, M-SCHEMA
//   ROLE: BARREL
//   MAP_MODE: SUMMARY
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   PrismaModule - global PrismaService provider barrel
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import {Global, Module} from '@nestjs/common';
import {PrismaService} from './prisma.service';

// START_CONTRACT: PrismaModule
//   PURPOSE: Register PrismaService as a global injectable.
//   INPUTS: { none }
//   OUTPUTS: { Nest module metadata - providers, exports }
//   SIDE_EFFECTS: none
//   LINKS: M-PRISMA, V-M-PRISMA
// END_CONTRACT: PrismaModule
@Global()
@Module({
  // START_BLOCK_PRISMA_PROVIDERS
  providers: [PrismaService],
  exports: [PrismaService],
  // END_BLOCK_PRISMA_PROVIDERS
})
export class PrismaModule {
}

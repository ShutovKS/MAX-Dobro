// FILE: backend/test/global-teardown.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Stop the e2e Postgres container and remove volumes.
//   SCOPE: docker-compose down --volumes after Jest
//   DEPENDS: M-PRISMA
//   LINKS: V-M-SEED
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   globalTeardown - shut down the test database container
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { execSync } from 'child_process';

// START_CONTRACT: globalTeardown
//   PURPOSE: Tear down the test database container and volumes
//   INPUTS: { none }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: docker-compose down --volumes
//   LINKS: V-M-SEED
// END_CONTRACT: globalTeardown
export default async () => {
  // START_BLOCK_TEARDOWN_TEST_DB
  console.log('\nShutting down the test database container and volumes...');
  execSync('docker-compose -f test/docker-compose.yml down --volumes', {
    stdio: 'inherit',
  });
  // END_BLOCK_TEARDOWN_TEST_DB
};

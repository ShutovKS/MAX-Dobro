// FILE: backend/test/global-setup.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Start the e2e Postgres container and apply Prisma migrations.
//   SCOPE: Load test env, docker-compose up, prisma migrate deploy
//   DEPENDS: M-SCHEMA, M-PRISMA
//   LINKS: V-M-SEED
//   ROLE: TEST
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   globalSetup - bring up test DB and apply migrations before Jest
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';

// START_CONTRACT: globalSetup
//   PURPOSE: Recreate the test database container and apply migrations
//   INPUTS: { none }
//   OUTPUTS: { Promise<void> }
//   SIDE_EFFECTS: docker-compose down/up and prisma migrate deploy
//   LINKS: V-M-SEED
// END_CONTRACT: globalSetup
export default async () => {
  // START_BLOCK_SETUP_TEST_DB
  dotenv.config({ path: path.join(__dirname, '.env') });

  const composeFile = 'test/docker-compose.yml';

  console.log('\nEnsuring the test database container is down...');
  execSync(`docker-compose -f ${composeFile} down --volumes`, {
    stdio: 'inherit',
  });

  console.log('Starting the test database container...');
  execSync(`docker-compose -f ${composeFile} up -d`, {
    stdio: 'inherit',
  });

  console.log('Applying migrations to the test database...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('Migrations applied successfully.');
  // END_BLOCK_SETUP_TEST_DB
};

import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';

export default async () => {
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
};
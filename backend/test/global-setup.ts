import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';

export default async () => {
  console.log('\nStarting the test database container...');
  dotenv.config({ path: path.join(__dirname, '.env') });

  execSync('docker-compose -f test/docker-compose.yml up -d', {
    stdio: 'inherit',
  });

  console.log('Applying migrations to the test database...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('Migrations applied successfully.');
};
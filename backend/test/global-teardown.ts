import { execSync } from 'child_process';

export default async () => {
  console.log('\nShutting down the test database container...');
  execSync('docker-compose -f test/docker-compose.yml down', {
    stdio: 'inherit',
  });
};
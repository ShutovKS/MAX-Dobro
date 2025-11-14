import { execSync } from 'child_process';

export default async () => {
  console.log('\nShutting down the test database container and volumes...');
  execSync('docker-compose -f test/docker-compose.yml down --volumes', {
    stdio: 'inherit',
  });
};
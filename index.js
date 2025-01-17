import { randomBytes } from 'crypto';

const _generatedApiKeys = [];
const _pixQrCodes = [];

async function main() {
  console.log('Running Woovi in memory api mock...');
  const apiKey = randomBytes(64).toString('base64');
  console.log(`ApiKey: ${apiKey}`);
}

main();

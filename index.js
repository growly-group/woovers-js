import { randomBytes } from 'crypto';
import express from 'express';

const _generatedApiKeys = [];
const _pixQrCodes = [];

async function main() {
  console.log('Running Woovi in memory api mock...');
  const apiKey = randomBytes(64).toString('base64');
  console.log(`ApiKey: ${apiKey}`);
  const app = express();
  const port = 3000;

  app.get('/', async (req, res) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

main();

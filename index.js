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

  app.get('/api/v1/qr-code-static/:id', async (req, res) => {
    res.send({
      pixQrCode: {
        name: 'pix qrcode static',
        value: 100,
        comment: 'pix qrcode static',
        correlationID: 'fe7834b4060c488a9b0f89811be5f5cf',
        identifier: 'zr7833b4060c488a9b0f89811',
        paymentLinkID: '7777-6f71-427a-bf00-241681624586',
        paymentLinkUrl:
          'https://openpix.com.br/pay/fe7834b4060c488a9b0f89811be5f5cf',
        qrCodeImage:
          'https://api.openpix.com.br/openpix/charge/brcode/image/fe7834b4060c488a9b0f89811be5f5cf.png',
        brCode:
          '000201010212261060014br.gov.bcb.pix2584https://api.openpix.com.br/openpix/testing?transactionID=867ba5173c734202ac659721306b38c952040000530398654040.015802BR5909LOCALHOST6009Sao Paulo62360532867ba5173c734202ac659721306b38c963044BCA',
        createdAt: '2021-03-02T17:28:51.882Z',
        updatedAt: '2021-03-02T17:28:51.882Z',
      },
    });
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

main();

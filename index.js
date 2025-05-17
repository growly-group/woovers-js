import { randomBytes } from 'crypto';
import express from 'express';

const _generatedApiKeys = [];
const _pixQrCodes = [{
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
  }
}];

const getSingle = (conditions) => {
  const data = _pixQrCodes.find((item) => {
    return conditions.every((condition) => condition(item));
  });

  if (!data) {
    return {
      data: null,
      error: 'PixQrCode not found',
    };
  }

  return {
    data: data.pixQrCode,
    error: null,
  };
}

const getAllPaginated = (page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedData = _pixQrCodes.slice(startIndex, endIndex);
  return {
    data: paginatedData,
    pageInfo: {
      skip: startIndex,
      limit: limit,
      totalCount: _pixQrCodes.length,
      hasPreviousPage: startIndex > 0,
      hasNextPage: endIndex < _pixQrCodes.length
    }
  };
}

async function main() {
  console.log('Running Woovi in memory api mock...');
  const apiKey = randomBytes(64).toString('base64');
  console.log(`ApiKey: ${apiKey}`);
  const app = express();
  const port = 3000;

  app.get('/api/v1/qr-code-static/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = getSingle([
      (item) => item.pixQrCode.identifier === id,
    ]);

    if (!data) {
      return res.status(400).send({
        error: "PixQrCode not found",
      });
    }

    res.send({ pixQrCode: data });
  });

  app.get('/api/v1/qr-code-static', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { data, pageInfo } = getAllPaginated(page, limit);

    res.send({
      pageInfo,
      pixQrCodes: data,
    });
  });

  app.post('/api/v1/qr-code-static', async (req, res) => {
    res.send({
      pixQrCode: {
        value: 100,
        comment: "good",
        correlationID: "9134e286-6f71-427a-bf00-241681624586",
        identifier: "zr7833b4060c488a9b0f89811",
        paymentLinkID: "7777a23s-6f71-427a-bf00-241681624586",
        paymentLinkUrl: "https://openpix.com.br/pay/9134e286-6f71-427a-bf00-241681624586",
        qrCodeImage: "https://api.openpix.com.br/openpix/pixQrCode/brcode/image/9134e286-6f71-427a-bf00-241681624586.png",
        createdAt: "2021-03-02T17:28:51.882Z",
        updatedAt: "2021-03-02T17:28:51.882Z",
        brCode: "000201010212261060014br.gov.bcb.pix2584https://api.openpix.com.br/openpix/testing?transactionID=867ba5173c734202ac659721306b38c952040000530398654040.015802BR5909LOCALHOST6009Sao Paulo62360532867ba5173c734202ac659721306b38c963044BCA"
      }
    })
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

main();

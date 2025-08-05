import { randomBytes, randomUUID } from 'crypto';
import express from 'express';
import { generateBRCode } from './brcode.js';

const _generatedApiKeys = [];
const _pixQrCodes: PixQrCode[] = [];

type PixQrCode = {
  name: string;
  correlationID: string;
  value: number;
  comment?: string;
  identifier: string;
  paymentLinkID: string;
  paymentLinkUrl: string;
  qrCodeImage: string;
  brCode: string;
  createdAt: string;
  updatedAt: string;
};


const generateIdentifier = (): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 25; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const existingIdentifier = _pixQrCodes.find(item => item.identifier === result);

  if (existingIdentifier) {
    return generateIdentifier();
  }

  return result;
}

type CreatePixQrCodeInput = {
  name: string;
  correlationID: string;
  value: number;
  comment?: string;
};

const createPixQrCode = (data: CreatePixQrCodeInput): { data: PixQrCode | null; error: string | null } => {
  const { name, correlationID, value, comment } = data;

  if (!name) {
    return {
      data: null,
      error: 'Name is required',
    };
  }

  if (typeof value !== 'number' || value <= 0) {
    return {
      data: null,
      error: 'Value should be a positive number',
    };
  }

  const identifier = generateIdentifier();

  const newPixQrCode:PixQrCode = {
      name,
      correlationID,
      value,
      comment,
      identifier,
      paymentLinkID: randomUUID(), // not correct, but ok for now
      paymentLinkUrl: `https://openpix.com.br/pay/${correlationID}`,
      qrCodeImage: `https://api.openpix.com.br/openpix/charge/brcode/image/${correlationID}.png`,
      brCode: generateBRCode(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    
  };

  _pixQrCodes.push(newPixQrCode);

  return {
    data: newPixQrCode,
    error: null,
  };
}

const getSingle = (conditions: Array<(item: PixQrCode) => boolean>): { data:PixQrCode | null; error: string | null } => {
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
    data: data,
    error: null,
  };
}

const getAllPaginated = (
  page: number,
  limit: number
): {
  data: PixQrCode[];
  pageInfo: {
    skip: number;
    limit: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
} => {
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

  app.use(express.json())

  app.get('/api/v1/qrcode-static/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = getSingle([
      (item) => item.identifier === id,
    ]);

    if (!data) {
      return res.status(400).send({
        error: "PixQrCode not found",
      });
    }

    res.send({ pixQrCode: data });
  });

  app.get('/api/v1/qrcode-static', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { data, pageInfo } = getAllPaginated(page, limit);

    res.send({
      pageInfo,
      pixQrCodes: data,
    });
  });

  app.post('/api/v1/qrcode-static', async (req, res) => {
    const { name, correlationID, value, comment } = req.body;

    if (!name) {
      return res.status(400).send({
        error: "Name is required",
      });
    }

    const { data, error } = createPixQrCode({
      name,
      correlationID,
      value,
      comment,
    });

    if (error) {
      return res.status(400).send({
        error,
      });
    }

    res.send({
      pixQrCode: data,
    });
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

main();

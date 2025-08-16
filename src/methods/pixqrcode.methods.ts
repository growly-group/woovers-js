import { CreatePixQrCodeInput } from '../types/CreatePixQrCodeInput';
import { PixQrCode } from '../types/PixQrCode';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response } from 'express';
import { DatabaseProvider, Paginated } from '../database/types';
import { generateBRCode } from '../utils/brcode';

const generateIdentifier = (db: DatabaseProvider): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 25; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  const existingIdentifier = db.getPixQrCodeByIdentifier(result);

  if (existingIdentifier) {
    return generateIdentifier(db);
  }

  return result;
};

const createPixQrCode = (db: DatabaseProvider, data: CreatePixQrCodeInput): { data: PixQrCode | null; error: string | null } => {
    const { name, correlationID, value, comment } = data;

    if (!name) {
      return {
        data: null,
        error: 'Name is required',
      };
    }

    if (!correlationID) {
      return {
        data: null,
        error: 'Correlation ID is required',
      };
    }

    if (value <= 0) {
      return {
        data: null,
        error: 'Value should be a positive number',
      };
    }

    const identifier = generateIdentifier(db);

    const newPixQrCode: PixQrCode = {
        name,
        correlationID,
        value,
        comment,
        identifier,
        paymentLinkID: uuidv4(),
        paymentLinkUrl: `https://openpix.com.br/pay/${correlationID}`,
        qrCodeImage: `https://api.openpix.com.br/openpix/charge/brcode/image/${correlationID}.png`,
        brCode: generateBRCode(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    db.createPixQrCode(newPixQrCode);

    return {
      data: newPixQrCode,
      error: null,
    };
}

const getSingle = (db: DatabaseProvider, identifier: string): { data: PixQrCode | null; error: string | null } => {
    const data = db.getPixQrCodeByIdentifier(identifier);

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
  db: DatabaseProvider,
  page: number,
  limit: number
): Paginated<PixQrCode> => {
  const offset = (page - 1) * limit;
  return db.getPixQrCodes(offset, limit);
}

export const getQrCodeStatic = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const db = req.context.db;

  const { data, pageInfo } = getAllPaginated(db, Number(page), Number(limit));

  res.send({
    pageInfo,
    pixQrCodes: data,
  });
}

export const getQrCodeStaticByID = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ error: 'Identifier is required' });
    }

    const db = req.context.db;
    const { data, error } = getSingle(db, id);

    if (error) {
      return res.status(404).send({ error });
    }

    res.send({ pixQrCode: data });
}

export const createQrCodeStatic = async (req: Request, res: Response) => {
    const { name, correlationID, value, comment } = req.body;

    const db = req.context.db;

    const { data, error } = createPixQrCode(db, {
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

    res.status(201).send({
      pixQrCode: data,
    });
}
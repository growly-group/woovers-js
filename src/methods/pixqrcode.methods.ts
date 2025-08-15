import { db } from "../db";
import { CreatePixQrCodeInput } from "../types/CreatePixQrCodeInput";
import { PixQrCode } from "../types/PixQrCode";
import { generateBRCode } from "../../brcode";
import { v4 as uuidv4 } from 'uuid';
import type {Request, Response} from "express";
import { Paginated } from '../types/paginated';

const generateIdentifier = (): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 25; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existingIdentifier = db.query("SELECT identifier FROM pix_qr_codes WHERE identifier = ?").get(result);

    if (existingIdentifier) {
      return generateIdentifier();
    }

    return result;
}

const createPixQrCode = (data: CreatePixQrCodeInput): { data: PixQrCode | null; error: string | null } => {
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
        paymentLinkID: uuidv4(),
        paymentLinkUrl: `https://openpix.com.br/pay/${correlationID}`,
        qrCodeImage: `https://api.openpix.com.br/openpix/charge/brcode/image/${correlationID}.png`,
        brCode: generateBRCode(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    db.run(
        "INSERT INTO pix_qr_codes (name, correlationID, value, comment, identifier, paymentLinkID, paymentLinkUrl, qrCodeImage, brCode, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [name, correlationID, value, comment, identifier, newPixQrCode.paymentLinkID, newPixQrCode.paymentLinkUrl, newPixQrCode.qrCodeImage, newPixQrCode.brCode, newPixQrCode.createdAt, newPixQrCode.updatedAt]
    );

    return {
      data: newPixQrCode,
      error: null,
    };
}

const getSingle = (identifier: string): { data: PixQrCode | null; error: string | null } => {
    const data = db.query("SELECT * FROM pix_qr_codes WHERE identifier = ?").get(identifier) as PixQrCode | null;

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
  ): Paginated<PixQrCode> => {
    const offset = (page - 1) * limit;
    const paginatedData = db.query("SELECT * FROM pix_qr_codes LIMIT $limit OFFSET $offset").all({$limit: limit, $offset: offset}) as PixQrCode[];
    const totalCountQuery = db.query("SELECT COUNT(*) as count FROM pix_qr_codes").get();
    const totalCount = totalCountQuery ? (totalCountQuery as any).count : 0;

    return {
      data: paginatedData,
      pageInfo: {
        skip: offset,
        limit: limit,
        totalCount: totalCount,
        hasPreviousPage: offset > 0,
        hasNextPage: offset + limit < totalCount
      }
    };
}

export const getQrCodeStatic = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const { data, pageInfo } = getAllPaginated(Number(page), Number(limit));

  res.send({
    pageInfo,
    pixQrCodes: data,
  });
}

export const getQrCodeStaticByID = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(req.params.id)
    const { data, error } = getSingle(id);

    if (error) {
      return res.status(404).send({ error });
    }

    res.send({ pixQrCode: data });
}

export const createQrCodeStatic = async (req: Request, res: Response) => {
    const { name, correlationID, value, comment } = req.body;

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

    res.status(201).send({
      pixQrCode: data,
    });
}
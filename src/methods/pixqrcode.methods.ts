import { _pixQrCodes } from "../db";
import { CreatePixQrCodeInput } from "../types/CreatePixQrCodeInput";
import { PixQrCode } from "../types/PixQrCode";
import { generateBRCode } from "../../brcode";
import { v4 as uuidv4 } from 'uuid';


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
        paymentLinkID: uuidv4(),
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

export const getQrCodeStatic = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { data, pageInfo } = getAllPaginated(page, limit);

  res.send({
    pageInfo,
    pixQrCodes: data,
  });
}

export const getQrCodeStaticByID = async (req, res) => {
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
}

export const createQrCodeStatic = async (req, res) => {
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
}

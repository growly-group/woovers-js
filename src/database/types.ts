import { PixQrCode } from "../types/PixQrCode";
import { Charge } from "../types/Charge";

export interface DatabaseProvider {
  getPixQrCodes(offset: number, limit: number): Paginated<PixQrCode>;
  getPixQrCodeByIdentifier(identifier: string): PixQrCode | null;
  getPixQrCodeByCorrelationID(correlationID: string): PixQrCode | null;
  createPixQrCode(pixQrCode: PixQrCode): void;
  createCharge(charge: Charge): void;
  getChargeByID(correlationID: string): Charge | null;
  getCharges(
    offset: number,
    limit: number,
    filters?: {
      start?: string;
      end?: string;
      status?: string;
      customer?: string;
      subscription?: string;
    }
  ): Paginated<Charge>;
  deleteCharge(id: string): { success: boolean; error?: string };
  updateChargeExpiresDate(id: string, expiresDate: string): { success: boolean; error?: string; expiresDate?: string };
}

export type Paginated<T> = {
  data: T[];
  pageInfo: {
    skip: number;
    limit: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }
}
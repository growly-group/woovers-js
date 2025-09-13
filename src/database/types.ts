import { PixQrCode } from "../types/PixQrCode";
import { Charge } from "../types/Charge";

export interface DatabaseProvider {
  getPixQrCodes(offset: number, limit: number): Paginated<PixQrCode>;
  getPixQrCodeByIdentifier(identifier: string): PixQrCode | null;
  createPixQrCode(pixQrCode: PixQrCode): void;
  createCharge(charge: Charge): void;
  getChargeByID(correlationID: string): Charge | null;
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
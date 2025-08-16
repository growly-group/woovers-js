import { PixQrCode } from "../types/PixQrCode";

export interface DatabaseProvider {
  getPixQrCodes(offset: number, limit: number): Paginated<PixQrCode>;
  getPixQrCodeByIdentifier(identifier: string): PixQrCode | null;
  createPixQrCode(pixQrCode: PixQrCode): void;
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
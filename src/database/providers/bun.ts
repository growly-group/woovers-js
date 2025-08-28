import { DatabaseProvider, Paginated } from '../types';
import { PixQrCode } from '../../types/PixQrCode';
import { Database } from 'bun:sqlite';

export class BunSqliteProvider implements DatabaseProvider {
  private db: Database;

  constructor() {
    const sqliteFileName = process.env.SQLITE_FILE_NAME || 'woovers.sqlite';

    this.db = new Database(sqliteFileName, { create: true });

    this.db.run(`
        CREATE TABLE IF NOT EXISTS pix_qr_codes
        (
            id
            INTEGER
            PRIMARY
            KEY
            AUTOINCREMENT,
            name
            TEXT,
            correlationID
            TEXT,
            value
            REAL,
            comment
            TEXT,
            identifier
            TEXT,
            paymentLinkID
            TEXT,
            paymentLinkUrl
            TEXT,
            qrCodeImage
            TEXT,
            brCode
            TEXT,
            createdAt
            TEXT,
            updatedAt
            TEXT
        )
    `);

    this.db.run(`
        CREATE TABLE IF NOT EXISTS api_keys
        (
            key
            TEXT
            PRIMARY
            KEY
        )
    `);
  }

  getPixQrCodes(offset: number, limit: number): Paginated<PixQrCode> {
    const pixQrCodeCount = this.db.query("SELECT COUNT(*) as count FROM pix_qr_codes").get() as number;
    const data = this.db.query("SELECT * FROM pix_qr_codes LIMIT $limit OFFSET $offset").all({ $limit: limit, $offset: offset }) as PixQrCode[];

    const totalCount = pixQrCodeCount;
    const hasPreviousPage = offset > 0;
    const hasNextPage = offset + limit < totalCount;
    return {
      data: data,
      pageInfo: {
        skip: offset,
        limit: limit,
        totalCount,
        hasPreviousPage,
        hasNextPage
      }
    };
  }

  getPixQrCodeByIdentifier(identifier: string): PixQrCode | null {
    return this.db.query('SELECT identifier FROM pix_qr_codes WHERE identifier = ?').get(identifier) as PixQrCode | null;
  }

  createPixQrCode(pixQrCode: PixQrCode): void {
    this.db.run(
      'INSERT INTO pix_qr_codes (name, correlationID, value, comment, identifier, paymentLinkID, paymentLinkUrl, qrCodeImage, brCode, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [pixQrCode.name, pixQrCode.correlationID, pixQrCode.value, pixQrCode.comment ?? "", pixQrCode.identifier, pixQrCode.paymentLinkID, pixQrCode.paymentLinkUrl, pixQrCode.qrCodeImage, pixQrCode.brCode, pixQrCode.createdAt, pixQrCode.updatedAt]
    );
  }
}

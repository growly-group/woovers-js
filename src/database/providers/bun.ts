import { DatabaseProvider, Paginated } from '../types';
import { PixQrCode } from '../../types/PixQrCode';
import { Charge } from '../../types/Charge';
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

    this.db.run(`
        CREATE TABLE IF NOT EXISTS charges (
            id TEXT PRIMARY KEY,
            correlationID TEXT NOT NULL,        
            value INTEGER NOT NULL,                
            type TEXT CHECK(type IN ('DYNAMIC', 'OVERDUE')),  
            comment TEXT,                          
            expiresIn INTEGER,                     
            expiresDate TEXT,                      
            customer TEXT,                         
            ensureSameTaxID BOOLEAN DEFAULT 0,     
            daysForDueDate INTEGER,                
            daysAfterDueDate INTEGER,              
            interests TEXT,                        
            fines TEXT,                            
            discountSettings TEXT,                 
            additionalInfo TEXT,                   
            enableCashbackPercentage BOOLEAN DEFAULT 0,
            enableCashbackExclusivePercentage BOOLEAN DEFAULT 0,
            subaccount TEXT,                       
            splits TEXT,                           
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,  
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP   
        )
    `);
  }

  getPixQrCodes(offset: number, limit: number): Paginated<PixQrCode> {
    const pixQrCodeCount = this.db.query("SELECT COUNT(*) as count FROM pix_qr_codes").get() as number;
    const data = this.db.query("SELECT * FROM pix_qr_codes LIMIT $limit OFFSET $offset").all({$limit: limit, $offset: offset}) as PixQrCode[];

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
      [pixQrCode.name, pixQrCode.correlationID, pixQrCode.value, pixQrCode.comment, pixQrCode.identifier, pixQrCode.paymentLinkID, pixQrCode.paymentLinkUrl, pixQrCode.qrCodeImage, pixQrCode.brCode, pixQrCode.createdAt, pixQrCode.updatedAt]
    );
  }

  createCharge(charge: Charge): void {
    this.db.run(
      'INSERT INTO charges (id, correlationID, value, type, comment, expiresIn, expiresDate, customer, ensureSameTaxID, daysForDueDate, daysAfterDueDate, interests, fines, discountSettings, additionalInfo, enableCashbackPercentage, enableCashbackExclusivePercentage, subaccount, splits) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        charge.id,
        charge.correlationID,
        charge.value,
        charge.type,
        charge.comment,
        charge.expiresIn,
        charge.expiresDate,
        JSON.stringify(charge.customer), 
        charge.ensureSameTaxID,
        charge.daysForDueDate,
        charge.daysAfterDueDate,
        JSON.stringify(charge.interests), 
        JSON.stringify(charge.fines), 
        JSON.stringify(charge.discountSettings), 
        JSON.stringify(charge.additionalInfo), 
        charge.enableCashbackPercentage,
        charge.enableCashbackExclusivePercentage,
        charge.subaccount,
        JSON.stringify(charge.splits), 
      ]
    );
  }

  getChargeByID(id: string): Charge | null {
    const result = this.db.query('SELECT * FROM charges WHERE correlationID = ? OR id = ?').get(id, id) as Charge;
    
    if (!result) {
      return null;
    }

    return {
      ...result,
      customer: typeof result.customer === 'string' ? JSON.parse(result.customer) : result.customer,
      interests: typeof result.interests === 'string' ? JSON.parse(result.interests) : result.interests,
      fines: typeof result.fines === 'string' ? JSON.parse(result.fines) : result.fines,
      discountSettings: typeof result.discountSettings === 'string' ? JSON.parse(result.discountSettings) : result.discountSettings,
      additionalInfo: typeof result.additionalInfo === 'string' ? JSON.parse(result.additionalInfo) : result.additionalInfo,
      splits: typeof result.splits === 'string' ? JSON.parse(result.splits) : result.splits,
    } as Charge;
  }

  getCharges(offset: number, limit: number, filters?: { start?: string; end?: string; status?: string; customer?: string; subscription?: string; }): Paginated<Charge> {
    const where: string[] = [];
    const params: Record<string, unknown> = { $limit: limit, $offset: offset };

    if (filters?.start) {
      where.push("datetime(createdAt) >= datetime($start)");
      params.$start = filters.start;
    }
    if (filters?.end) {
      where.push("datetime(createdAt) <= datetime($end)");
      params.$end = filters.end;
    }
    
    if (filters?.customer) {
      
      where.push("customer LIKE '%' || $customer || '%'");
      params.$customer = filters.customer;
    }
    if (filters?.subscription) {
      
      where.push("subaccount = $subscription");
      params.$subscription = filters.subscription;
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const countRow = this.db.query(`SELECT COUNT(*) as count FROM charges ${whereSql}`).get(params) as unknown as { count: number };
    const totalCount = countRow?.count ?? 0;

    const rows = this.db.query(`SELECT * FROM charges ${whereSql} LIMIT $limit OFFSET $offset`).all(params) as Charge[];

    const data = rows.map((row) => ({
      ...row,
      customer: typeof row.customer === 'string' ? JSON.parse(row.customer as unknown as string) : row.customer,
      interests: typeof row.interests === 'string' ? JSON.parse(row.interests as unknown as string) : row.interests,
      fines: typeof row.fines === 'string' ? JSON.parse(row.fines as unknown as string) : row.fines,
      discountSettings: typeof row.discountSettings === 'string' ? JSON.parse(row.discountSettings as unknown as string) : row.discountSettings,
      additionalInfo: typeof row.additionalInfo === 'string' ? JSON.parse(row.additionalInfo as unknown as string) : row.additionalInfo,
      splits: typeof row.splits === 'string' ? JSON.parse(row.splits as unknown as string) : row.splits,
    })) as Charge[];

    const hasPreviousPage = offset > 0;
    const hasNextPage = offset + limit < totalCount;

    return {
      data,
      pageInfo: {
        skip: offset,
        limit,
        totalCount,
        hasPreviousPage,
        hasNextPage,
      },
    };
  }
}

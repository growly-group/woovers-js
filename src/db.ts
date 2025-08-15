import { Database } from "bun:sqlite";

export const db = new Database("woovers.sqlite", { create: true });

// Create tables if they don't exist
db.run(`
  CREATE TABLE IF NOT EXISTS pix_qr_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    correlationID TEXT,
    value REAL,
    comment TEXT,
    identifier TEXT,
    paymentLinkID TEXT,
    paymentLinkUrl TEXT,
    qrCodeImage TEXT,
    brCode TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS api_keys (
    key TEXT PRIMARY KEY
  )
`);
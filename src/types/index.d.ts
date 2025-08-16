import type { DatabaseProvider } from '../database/types';

export type Context = {
  db: DatabaseProvider
}

declare module 'express-serve-static-core' {
  interface Request {
    context: Context;
  }
}
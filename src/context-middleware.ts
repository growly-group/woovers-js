import type { Request, Response, NextFunction } from 'express';
import type { DatabaseProvider } from './database/types';

export function contextMiddleware(db: DatabaseProvider) {
  return (req: Request, _: Response, next: NextFunction) => {
    req.context = {
      db,
    }
    next();
  };
}

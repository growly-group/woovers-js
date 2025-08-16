import express from 'express';
import { apiKey } from './utils/utils';
import qrCodeStaticRouter from './routes/qrcode-static.routes';
import { getDatabaseProvider } from './database/providers/get-provider';
import { contextMiddleware } from './context-middleware';

const app = express();

const {error, provider: db} = getDatabaseProvider();

if (error || !db) {
  throw new Error('Database provider not found');
}

app.use(contextMiddleware(db));
app.use(express.json());
app.use('/api/v1/', qrCodeStaticRouter )

export {app, apiKey};

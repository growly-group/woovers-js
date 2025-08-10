import express from 'express';
import { apiKey } from './utils/utils';
import qrCodeStaticRouter from './routes/qrcode-static.routes';

const app = express();

app.use(express.json());
app.use('/api/v1/', qrCodeStaticRouter )

export {app, apiKey};

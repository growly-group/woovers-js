import { config } from 'dotenv';
import { app, apiKey } from './app';
import cors from 'cors';
config();

const allowedOrigins = [
    'http://localhost:3000'
]

const corsOptions = {
    origin: allowedOrigins
}
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`running in ${PORT} w/ apiKey: ${apiKey()}`));

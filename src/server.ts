import dotenv from 'dotenv';
import app  from './app';
import cors from 'cors'; 
dotenv.config();

const corsOptions = [
    'http://localhost:3000'
]
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3001 
app.listen(PORT, () => console.log('running in', PORT));

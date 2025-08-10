import { randomBytes } from 'crypto';


export const apiKey = randomBytes(64).toString('base64');
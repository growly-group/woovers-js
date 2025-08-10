import { randomBytes } from 'crypto';


export const apiKey = (): string => randomBytes(64).toString('base64');

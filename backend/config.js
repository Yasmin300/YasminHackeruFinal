import dotenv from 'dotenv';
const envFile = process.env.NODE_ENV === 'cloud' ? '.env.cloud' : '.env';
dotenv.config({ path: envFile });
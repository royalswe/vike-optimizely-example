import dotenv from 'dotenv';

const isProduction = process.env.NODE_ENV === 'production';
const envFile = isProduction ? `.env.production` : '.env.development';
dotenv.config({ path: envFile });

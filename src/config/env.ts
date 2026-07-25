import dotenv from 'dotenv';

dotenv.config();

const required = (envName: string): string => {
   const value = process.env[envName];

   if (!value) {
      throw new Error(`${envName} is missing`);
   }

   return value;
};

export const env = {
   PORT: Number(process.env.PORT ?? 8000),
   DATABASE_URL: required('DATABASE_URL'),
   JWT_SECRET: required('JWT_SECRET'),
   GEMINI_API_KEY: required('GEMINI_API_KEY'),
};

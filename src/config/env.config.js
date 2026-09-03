import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['PORT', 'NODE_ENV', 'MONGO_URI'];

for (const variable of requiredEnvVars) {
  if (!process.env[variable]) {
    throw new Error(`Falta la variable de entorno requerida: ${variable}`);
  }
}

const config = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  mongoUri: process.env.MONGO_URI
};

if (Number.isNaN(config.port)) {
  throw new Error('PORT debe ser un número válido');
}

export default config;

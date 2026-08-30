import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVariables = ['PORT', 'NODE_ENV'];

const missingVariables = requiredEnvVariables.filter(
  (variable) => !process.env[variable]
);

if (missingVariables.length > 0) {
  throw new Error(
    `Faltan variables de entorno requeridas: ${missingVariables.join(', ')}`
  );
}

const config = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
};

if (Number.isNaN(config.port)) {
  throw new Error('La variable PORT debe ser un número válido.');
}

export default config;

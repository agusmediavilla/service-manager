import dotenv from 'dotenv';

dotenv.config();

const requiredVariables = ['PORT', 'NODE_ENV'];
const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);

if (missingVariables.length > 0) {
  console.error(
    `Error de configuración: faltan variables de entorno requeridas: ${missingVariables.join(', ')}`
  );
  process.exit(1);
}

const port = Number(process.env.PORT);

if (Number.isNaN(port)) {
  console.error('Error de configuración: PORT debe ser un número válido.');
  process.exit(1);
}

const env = {
  port,
  nodeEnv: process.env.NODE_ENV,
};

export default env;

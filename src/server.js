import app from './app.js';
import config from './config/env.config.js';
import { connectDatabase } from './config/db.config.js';

const startServer = async () => {
  await connectDatabase();

  app.listen(config.port, () => {
    console.log(
      `Servidor ejecutándose en http://localhost:${config.port} - ${config.nodeEnv}`
    );
  });
};

startServer();

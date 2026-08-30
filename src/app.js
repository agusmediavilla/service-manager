import config from './config/env.config.js';
import ServiceManager from './managers/ServiceManager.js';

const serviceManager = new ServiceManager();

const main = async () => {
  console.log(`Aplicación iniciada en modo: ${config.nodeEnv}`);
  console.log(`Puerto configurado: ${config.port}`);

  const services = await serviceManager.getServices();
  console.log('Servicios disponibles:');
  console.table(services);
};

main().catch((error) => {
  console.error('Error al iniciar la aplicación:', error.message);
  process.exit(1);
});

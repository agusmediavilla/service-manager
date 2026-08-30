import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ServiceManager {
  constructor() {
    this.filePath = path.join(__dirname, '../data/services.json');
  }

  async #readServices() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this.#writeServices([]);
        return [];
      }

      throw new Error(`No se pudieron leer los servicios: ${error.message}`);
    }
  }

  async #writeServices(services) {
    try {
      await fs.writeFile(
        this.filePath,
        JSON.stringify(services, null, 2),
        'utf-8'
      );
    } catch (error) {
      throw new Error(`No se pudieron guardar los servicios: ${error.message}`);
    }
  }

  async getServices() {
    return await this.#readServices();
  }

  async getServiceById(id) {
    const services = await this.#readServices();
    const serviceId = Number(id);

    return services.find((service) => service.id === serviceId) ?? null;
  }

  async addService(serviceData) {
    const requiredFields = [
      'name',
      'description',
      'duration',
      'price',
      'category',
      'available',
    ];

    const missingFields = requiredFields.filter(
      (field) =>
        serviceData[field] === undefined ||
        serviceData[field] === null ||
        serviceData[field] === ''
    );

    if (missingFields.length > 0) {
      throw new Error(
        `El servicio está incompleto. Faltan los campos: ${missingFields.join(', ')}`
      );
    }

    const services = await this.#readServices();

    const nextId =
      services.length === 0
        ? 1
        : Math.max(...services.map((service) => service.id)) + 1;

    const newService = {
      id: nextId,
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available,
    };

    services.push(newService);
    await this.#writeServices(services);

    return newService;
  }

  async updateService(id, updatedData) {
    const services = await this.#readServices();
    const serviceId = Number(id);

    const serviceIndex = services.findIndex(
      (service) => service.id === serviceId
    );

    if (serviceIndex === -1) {
      return null;
    }

    const { id: ignoredId, ...allowedUpdates } = updatedData;

    services[serviceIndex] = {
      ...services[serviceIndex],
      ...allowedUpdates,
      id: services[serviceIndex].id,
    };

    await this.#writeServices(services);

    return services[serviceIndex];
  }

  async deleteService(id) {
    const services = await this.#readServices();
    const serviceId = Number(id);

    const serviceIndex = services.findIndex(
      (service) => service.id === serviceId
    );

    if (serviceIndex === -1) {
      return null;
    }

    const [deletedService] = services.splice(serviceIndex, 1);
    await this.#writeServices(services);

    return deletedService;
  }
}

export default ServiceManager;

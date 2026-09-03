import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ServiceManager {
  constructor(filePath = path.join(__dirname, '../data/services.json')) {
    this.filePath = filePath;
  }

  async #readServices() {
    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      return content.trim() ? JSON.parse(content) : [];
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        await fs.writeFile(this.filePath, '[]', 'utf-8');
        return [];
      }
      throw error;
    }
  }

  async #writeServices(services) {
    await fs.writeFile(this.filePath, JSON.stringify(services, null, 2), 'utf-8');
  }

  async getServices() {
    return this.#readServices();
  }

  async getServiceById(id) {
    const services = await this.#readServices();
    return services.find((service) => service.id === Number(id)) ?? null;
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
      (field) => serviceData[field] === undefined || serviceData[field] === null || serviceData[field] === ''
    );

    if (missingFields.length > 0) {
      throw new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
    }

    const services = await this.#readServices();
    const nextId = services.length > 0 ? Math.max(...services.map((service) => service.id)) + 1 : 1;

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
    const index = services.findIndex((service) => service.id === Number(id));

    if (index === -1) {
      return null;
    }

    const { id: ignoredId, ...safeUpdates } = updatedData;

    services[index] = {
      ...services[index],
      ...safeUpdates,
      id: services[index].id,
    };

    await this.#writeServices(services);
    return services[index];
  }

  async deleteService(id) {
    const services = await this.#readServices();
    const index = services.findIndex((service) => service.id === Number(id));

    if (index === -1) {
      return null;
    }

    const [deletedService] = services.splice(index, 1);
    await this.#writeServices(services);

    return deletedService;
  }
}

export default ServiceManager;

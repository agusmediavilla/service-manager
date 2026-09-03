import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ServiceManager {
  constructor(filePath = path.join(__dirname, '../data/services.json')) {
    this.path = filePath;
  }

  async _readServices() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      if (!data.trim()) return [];
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(this.path, '[]', 'utf-8');
        return [];
      }
      throw error;
    }
  }

  async _writeServices(services) {
    await fs.writeFile(
      this.path,
      JSON.stringify(services, null, 2),
      'utf-8'
    );
  }

  async getServices() {
    return await this._readServices();
  }

  async getServiceById(id) {
    const services = await this._readServices();
    const numericId = Number(id);
    return services.find(service => service.id === numericId) ?? null;
  }

  async addService(serviceData) {
    const requiredFields = [
      'name',
      'description',
      'duration',
      'price',
      'category',
      'available'
    ];

    const missingFields = requiredFields.filter(
      field =>
        !(field in serviceData) ||
        serviceData[field] === undefined ||
        serviceData[field] === null ||
        (typeof serviceData[field] === 'string' && serviceData[field].trim() === '')
    );

    if (missingFields.length > 0) {
      throw new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
    }

    const services = await this._readServices();
    const newId =
      services.length > 0
        ? Math.max(...services.map(service => Number(service.id))) + 1
        : 1;

    const newService = {
      id: newId,
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available
    };

    services.push(newService);
    await this._writeServices(services);

    return newService;
  }

  async updateService(id, updatedData) {
    const services = await this._readServices();
    const numericId = Number(id);

    const index = services.findIndex(service => service.id === numericId);
    if (index === -1) return null;

    const { id: ignoredId, ...safeData } = updatedData;

    services[index] = {
      ...services[index],
      ...safeData,
      id: services[index].id
    };

    await this._writeServices(services);
    return services[index];
  }

  async deleteService(id) {
    const services = await this._readServices();
    const numericId = Number(id);

    const index = services.findIndex(service => service.id === numericId);
    if (index === -1) return null;

    const [deletedService] = services.splice(index, 1);
    await this._writeServices(services);

    return deletedService;
  }
}

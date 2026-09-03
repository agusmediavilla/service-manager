import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ServicesDAO {
  constructor(filePath = path.join(__dirname, '../data/services.json')) {
    this.path = filePath;
  }

  async _read() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return data.trim() ? JSON.parse(data) : [];
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(this.path, '[]', 'utf-8');
        return [];
      }
      throw error;
    }
  }

  async _write(services) {
    await fs.writeFile(this.path, JSON.stringify(services, null, 2), 'utf-8');
  }

  async getAll() {
    return this._read();
  }

  async getById(id) {
    const services = await this._read();
    return services.find(service => service.id === Number(id)) ?? null;
  }

  async create(service) {
    const services = await this._read();
    services.push(service);
    await this._write(services);
    return service;
  }

  async update(id, updatedService) {
    const services = await this._read();
    const index = services.findIndex(service => service.id === Number(id));

    if (index === -1) return null;

    services[index] = updatedService;
    await this._write(services);

    return services[index];
  }

  async delete(id) {
    const services = await this._read();
    const index = services.findIndex(service => service.id === Number(id));

    if (index === -1) return null;

    const [deletedService] = services.splice(index, 1);
    await this._write(services);

    return deletedService;
  }
}

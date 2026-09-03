import mongoose from 'mongoose';

export default class ServicesService {
  constructor(repository) {
    this.repository = repository;
  }

  async getServices(filters = {}) {
    const mongoFilters = {};

    if (filters.category) mongoFilters.category = filters.category;

    if (filters.available !== undefined) {
      mongoFilters.available =
        String(filters.available).toLowerCase() === 'true';
    }

    return this.repository.getAll(mongoFilters);
  }

  async getServiceById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return this.repository.getById(id);
  }

  async createService(data) {
    const requiredFields = [
      'name','description','duration','price','category','available'
    ];

    const missing = requiredFields.filter(
      field =>
        !(field in data) ||
        data[field] === undefined ||
        data[field] === null ||
        (typeof data[field] === 'string' && data[field].trim() === '')
    );

    if (missing.length) {
      throw new Error(`Faltan campos obligatorios: ${missing.join(', ')}`);
    }

    const { id, _id, ...safeData } = data;
    return this.repository.create(safeData);
  }

  async updateService(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const existing = await this.repository.getById(id);
    if (!existing) return null;

    const { id: ignoredId, _id: ignoredMongoId, ...safeData } = data;
    return this.repository.update(id, safeData);
  }

  async deleteService(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return this.repository.delete(id);
  }
}

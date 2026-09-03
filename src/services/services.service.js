import mongoose from 'mongoose';

export default class ServicesService {
  constructor(repository) {
    this.repository = repository;
  }

  async getServices(filters = {}) {
    const mongoFilters = {};

    if (filters.category) {
      mongoFilters.category = filters.category;
    }

    if (filters.available !== undefined) {
      mongoFilters.available = String(filters.available).toLowerCase() === 'true';
    }

    return this.repository.getAll(mongoFilters);
  }

  async getServiceById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return this.repository.getById(id);
  }

  async createService(serviceData) {
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

    const {
      id,
      _id,
      ...safeData
    } = serviceData;

    return this.repository.create(safeData);
  }

  async updateService(id, updatedData) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const existingService = await this.repository.getById(id);
    if (!existingService) return null;

    const {
      id: ignoredId,
      _id: ignoredMongoId,
      ...safeData
    } = updatedData;

    return this.repository.update(id, safeData);
  }

  async deleteService(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return this.repository.delete(id);
  }
}

import ServiceModel from '../models/service.model.js';

export default class ServicesDAO {
  async getAll(filters = {}) {
    return ServiceModel.find(filters).lean();
  }

  async getById(id) {
    return ServiceModel.findById(id).lean();
  }

  async create(serviceData) {
    const service = await ServiceModel.create(serviceData);
    return service.toObject();
  }

  async update(id, updatedData) {
    return ServiceModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true
      }
    ).lean();
  }

  async delete(id) {
    return ServiceModel.findByIdAndDelete(id).lean();
  }
}

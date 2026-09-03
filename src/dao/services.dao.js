import ServiceModel from '../models/service.model.js';

export default class ServicesDAO {
  async getAll(filters = {}) {
    return ServiceModel.find(filters).lean();
  }

  async getById(id) {
    return ServiceModel.findById(id).lean();
  }

  async create(data) {
    const service = await ServiceModel.create(data);
    return service.toObject();
  }

  async update(id, data) {
    return ServiceModel.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).lean();
  }

  async delete(id) {
    return ServiceModel.findByIdAndDelete(id).lean();
  }
}

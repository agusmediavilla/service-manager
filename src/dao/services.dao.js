import ServiceModel from '../models/service.model.js';

export default class ServicesDAO {
  async getAll({ filters = {}, page = 1, limit = 10, sortBy = 'createdAt', order = 'asc' }) {
    const skip = (page - 1) * limit;
    const sortDirection = order === 'desc' ? -1 : 1;

    const [docs, total] = await Promise.all([
      ServiceModel.find(filters)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(limit)
        .lean(),
      ServiceModel.countDocuments(filters)
    ]);

    return { docs, total };
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

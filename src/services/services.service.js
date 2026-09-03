import mongoose from 'mongoose';

const ALLOWED_SORT_FIELDS = [
  'name',
  'duration',
  'price',
  'category',
  'available',
  'createdAt',
  'updatedAt'
];

export default class ServicesService {
  constructor(repository) {
    this.repository = repository;
  }

  async getServices(query = {}) {
    const {
      category,
      available,
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      order = 'asc'
    } = query;

    const filters = {};

    if (category) {
      filters.category = category;
    }

    if (available !== undefined) {
      filters.available = String(available).toLowerCase() === 'true';
    }

    const currentPage = Math.max(Number(page) || 1, 1);
    const currentLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const validSortBy = ALLOWED_SORT_FIELDS.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const validOrder = order === 'desc' ? 'desc' : 'asc';

    const { docs, total } = await this.repository.getAll({
      filters,
      page: currentPage,
      limit: currentLimit,
      sortBy: validSortBy,
      order: validOrder
    });

    const totalPages = total === 0 ? 0 : Math.ceil(total / currentLimit);

    return {
      payload: docs,
      pagination: {
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < totalPages
      }
    };
  }

  async getServiceById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return this.repository.getById(id);
  }

  async createService(data) {
    return this.repository.create(data);
  }

  async updateService(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const existing = await this.repository.getById(id);
    if (!existing) return null;

    return this.repository.update(id, data);
  }

  async deleteService(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return this.repository.delete(id);
  }
}

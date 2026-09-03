export default class ServicesRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll(filters = {}) {
    return this.dao.getAll(filters);
  }

  async getById(id) {
    return this.dao.getById(id);
  }

  async create(data) {
    return this.dao.create(data);
  }

  async update(id, data) {
    return this.dao.update(id, data);
  }

  async delete(id) {
    return this.dao.delete(id);
  }
}

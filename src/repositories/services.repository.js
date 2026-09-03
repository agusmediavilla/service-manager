export default class ServicesRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return this.dao.getAll();
  }

  async getById(id) {
    return this.dao.getById(id);
  }

  async create(service) {
    return this.dao.create(service);
  }

  async update(id, service) {
    return this.dao.update(id, service);
  }

  async delete(id) {
    return this.dao.delete(id);
  }
}

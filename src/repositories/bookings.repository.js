export default class BookingsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(data) {
    return this.dao.create(data);
  }

  getById(id) {
    return this.dao.getById(id);
  }

  getByIdRaw(id) {
    return this.dao.getByIdRaw(id);
  }

  getAll() {
    return this.dao.getAll();
  }

  update(id, data) {
    return this.dao.update(id, data);
  }
}

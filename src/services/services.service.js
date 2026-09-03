export default class ServicesService {
  constructor(repository) {
    this.repository = repository;
  }

  async getServices(filters = {}) {
    const services = await this.repository.getAll();
    const { category, available } = filters;

    let filteredServices = services;

    if (category) {
      filteredServices = filteredServices.filter(
        service =>
          service.category.toLowerCase() === String(category).toLowerCase()
      );
    }

    if (available !== undefined) {
      const availableValue = String(available).toLowerCase() === 'true';

      filteredServices = filteredServices.filter(
        service => service.available === availableValue
      );
    }

    return filteredServices;
  }

  async getServiceById(id) {
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

    const services = await this.repository.getAll();
    const newId =
      services.length > 0
        ? Math.max(...services.map(service => Number(service.id))) + 1
        : 1;

    const newService = {
      id: newId,
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available
    };

    return this.repository.create(newService);
  }

  async updateService(id, updatedData) {
    const existingService = await this.repository.getById(id);

    if (!existingService) return null;

    const { id: ignoredId, ...safeData } = updatedData;

    const updatedService = {
      ...existingService,
      ...safeData,
      id: existingService.id
    };

    return this.repository.update(id, updatedService);
  }

  async deleteService(id) {
    return this.repository.delete(id);
  }
}

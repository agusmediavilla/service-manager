import ServiceManager from '../managers/ServiceManager.js';

const serviceManager = new ServiceManager();

export const getServices = async (req, res) => {
  try {
    const services = await serviceManager.getServices();
    const { category, available } = req.query;

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

    return res.status(200).json({
      status: 'success',
      payload: filteredServices
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { sid } = req.params;
    const service = await serviceManager.getServiceById(sid);

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    return res.status(200).json({
      status: 'success',
      payload: service
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const createService = async (req, res) => {
  try {
    const newService = await serviceManager.addService(req.body);

    return res.status(201).json({
      status: 'success',
      payload: newService
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { sid } = req.params;
    const updatedService = await serviceManager.updateService(sid, req.body);

    if (!updatedService) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    return res.status(200).json({
      status: 'success',
      payload: updatedService
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { sid } = req.params;
    const deletedService = await serviceManager.deleteService(sid);

    if (!deletedService) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    return res.status(200).json({
      status: 'success',
      payload: deletedService
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

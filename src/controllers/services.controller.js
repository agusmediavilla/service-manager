import ServicesDAO from '../dao/services.dao.js';
import ServicesRepository from '../repositories/services.repository.js';
import ServicesService from '../services/services.service.js';

const servicesDAO = new ServicesDAO();
const servicesRepository = new ServicesRepository(servicesDAO);
const servicesService = new ServicesService(servicesRepository);

export const getServices = async (req, res) => {
  try {
    const services = await servicesService.getServices(req.query);

    return res.status(200).json({
      status: 'success',
      payload: services
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
    const service = await servicesService.getServiceById(req.params.sid);

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
    const newService = await servicesService.createService(req.body);

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
    const updatedService = await servicesService.updateService(
      req.params.sid,
      req.body
    );

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
    const deletedService = await servicesService.deleteService(req.params.sid);

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

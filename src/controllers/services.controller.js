import ServicesDAO from '../dao/services.dao.js';
import ServicesRepository from '../repositories/services.repository.js';
import ServicesService from '../services/services.service.js';

const servicesService = new ServicesService(
  new ServicesRepository(new ServicesDAO())
);

export const getServices = async (req, res) => {
  try {
    const result = await servicesService.getServices(req.query);

    return res.status(200).json({
      status: 'success',
      payload: result.payload,
      pagination: result.pagination
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
    const service = await servicesService.createService(req.body);

    const io = req.app.get('io');
    if (io) io.emit('serviceCreated', service);

    return res.status(201).json({
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

export const updateService = async (req, res) => {
  try {
    const service = await servicesService.updateService(
      req.params.sid,
      req.body
    );

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    const io = req.app.get('io');
    if (io) io.emit('serviceUpdated', service);

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

export const deleteService = async (req, res) => {
  try {
    const service = await servicesService.deleteService(req.params.sid);

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    const io = req.app.get('io');
    if (io) io.emit('serviceDeleted', { id: req.params.sid });

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

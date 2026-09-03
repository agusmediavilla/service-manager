import ServicesDAO from '../dao/services.dao.js';
import ServicesRepository from '../repositories/services.repository.js';
import ServicesService from '../services/services.service.js';

const service = new ServicesService(
  new ServicesRepository(new ServicesDAO())
);

export const getServices = async (req, res) => {
  try {
    const result = await service.getServices(req.query);

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
    const data = await service.getServiceById(req.params.sid);

    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    return res.status(200).json({
      status: 'success',
      payload: data
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
    const data = await service.createService(req.body);

    return res.status(201).json({
      status: 'success',
      payload: data
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
    const data = await service.updateService(req.params.sid, req.body);

    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    return res.status(200).json({
      status: 'success',
      payload: data
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
    const data = await service.deleteService(req.params.sid);

    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    return res.status(200).json({
      status: 'success',
      payload: data
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

import { Router } from 'express';
import ServiceManager from '../managers/ServiceManager.js';

const router = Router();
const serviceManager = new ServiceManager();

router.get('/', async (req, res) => {
  try {
    const { category, available } = req.query;
    let services = await serviceManager.getServices();

    if (category) {
      services = services.filter(
        (service) => service.category.toLowerCase() === String(category).toLowerCase()
      );
    }

    if (available !== undefined) {
      const availableBoolean = String(available).toLowerCase() === 'true';
      services = services.filter((service) => service.available === availableBoolean);
    }

    return res.status(200).json({
      status: 'success',
      payload: services,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/:sid', async (req, res) => {
  try {
    const { sid } = req.params;
    const service = await serviceManager.getServiceById(sid);

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado',
      });
    }

    return res.status(200).json({ status: 'success', payload: service });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newService = await serviceManager.addService(req.body);

    return res.status(201).json({
      status: 'success',
      payload: newService,
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
});

router.put('/:sid', async (req, res) => {
  try {
    const { sid } = req.params;
    const updatedService = await serviceManager.updateService(sid, req.body);

    if (!updatedService) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado',
      });
    }

    return res.status(200).json({
      status: 'success',
      payload: updatedService,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/:sid', async (req, res) => {
  try {
    const { sid } = req.params;
    const deletedService = await serviceManager.deleteService(sid);

    if (!deletedService) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado',
      });
    }

    return res.status(200).json({
      status: 'success',
      payload: deletedService,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;

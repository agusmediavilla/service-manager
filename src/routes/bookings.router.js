import { Router } from 'express';
import BookingManager from '../managers/BookingManager.js';
import ServiceManager from '../managers/ServiceManager.js';

const router = Router();

const bookingManager = new BookingManager();
const serviceManager = new ServiceManager();

router.post('/', async (req, res) => {
  try {
    const newBooking = await bookingManager.createBooking(req.body);

    return res.status(201).json({
      status: 'success',
      payload: newBooking
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.get('/:bid', async (req, res) => {
  try {
    const booking = await bookingManager.getBookingById(req.params.bid);

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Reserva no encontrada'
      });
    }

    return res.status(200).json({
      status: 'success',
      payload: booking
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/:bid/services/:sid', async (req, res) => {
  try {
    const booking = await bookingManager.getBookingById(req.params.bid);

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Reserva no encontrada'
      });
    }

    const service = await serviceManager.getServiceById(req.params.sid);

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    const updatedBooking = await bookingManager.addServiceToBooking(
      req.params.bid,
      req.params.sid
    );

    return res.status(200).json({
      status: 'success',
      payload: updatedBooking
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;

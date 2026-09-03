import BookingManager from '../managers/BookingManager.js';
import ServiceManager from '../managers/ServiceManager.js';

const bookingManager = new BookingManager();
const serviceManager = new ServiceManager();

export const createBooking = async (req, res) => {
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
};

export const getBookingById = async (req, res) => {
  try {
    const { bid } = req.params;
    const booking = await bookingManager.getBookingById(bid);

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
};

export const addServiceToBooking = async (req, res) => {
  try {
    const { bid, sid } = req.params;

    const booking = await bookingManager.getBookingById(bid);

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Reserva no encontrada'
      });
    }

    const service = await serviceManager.getServiceById(sid);

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    const updatedBooking = await bookingManager.addServiceToBooking(bid, sid);

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
};

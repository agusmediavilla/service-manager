import BookingsDAO from '../dao/bookings.dao.js';
import ServicesDAO from '../dao/services.dao.js';
import BookingsRepository from '../repositories/bookings.repository.js';
import ServicesRepository from '../repositories/services.repository.js';
import BookingsService from '../services/bookings.service.js';

const bookingsDAO = new BookingsDAO();
const servicesDAO = new ServicesDAO();

const bookingsRepository = new BookingsRepository(bookingsDAO);
const servicesRepository = new ServicesRepository(servicesDAO);

const bookingsService = new BookingsService(
  bookingsRepository,
  servicesRepository
);

export const createBooking = async (req, res) => {
  try {
    const booking = await bookingsService.createBooking(req.body);

    return res.status(201).json({
      status: 'success',
      payload: booking
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
    const booking = await bookingsService.getBookingById(req.params.bid);

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
    const result = await bookingsService.addServiceToBooking(
      req.params.bid,
      req.params.sid
    );

    if (result.type === 'booking_not_found') {
      return res.status(404).json({
        status: 'error',
        message: 'Reserva no encontrada'
      });
    }

    if (result.type === 'service_not_found') {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    return res.status(200).json({
      status: 'success',
      payload: result.data
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

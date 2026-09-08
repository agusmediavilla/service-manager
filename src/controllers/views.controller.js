import ServicesDAO from '../dao/services.dao.js';
import BookingsDAO from '../dao/bookings.dao.js';
import ServicesRepository from '../repositories/services.repository.js';
import BookingsRepository from '../repositories/bookings.repository.js';
import ServicesService from '../services/services.service.js';
import BookingsService from '../services/bookings.service.js';

const servicesRepository = new ServicesRepository(new ServicesDAO());
const bookingsRepository = new BookingsRepository(new BookingsDAO());

const servicesService = new ServicesService(servicesRepository);
const bookingsService = new BookingsService(
  bookingsRepository,
  servicesRepository
);

export const renderServices = async (req, res) => {
  try {
    const result = await servicesService.getServices({
      page: '1',
      limit: '100',
      sortBy: 'name',
      order: 'asc'
    });

    return res.render('services', {
      title: 'Servicios',
      services: result.payload
    });
  } catch (error) {
    return res.status(500).send('Error al cargar los servicios');
  }
};

export const renderBookings = async (req, res) => {
  try {
    const bookings = await bookingsService.getBookings();

    return res.render('bookings', {
      title: 'Reservas',
      bookings
    });
  } catch (error) {
    return res.status(500).send('Error al cargar las reservas');
  }
};

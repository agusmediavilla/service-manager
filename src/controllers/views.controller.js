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
    const services = await servicesService.getServices();

    return res.render('services', {
      title: 'Servicios',
      services
    });
  } catch (error) {
    return res.status(500).send('Error al cargar los servicios');
  }
};

export const renderAvailability = async (req, res) => {
  try {
    const availableServices = await servicesService.getServices({
      available: 'true'
    });

    const bookings = await bookingsService.getBookings();

    return res.render('availability', {
      title: 'Disponibilidad y reservas',
      availableServices,
      bookings
    });
  } catch (error) {
    return res.status(500).send('Error al cargar disponibilidad');
  }
};

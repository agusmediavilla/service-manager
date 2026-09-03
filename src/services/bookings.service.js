export default class BookingsService {
  constructor(bookingsRepository, servicesRepository) {
    this.bookingsRepository = bookingsRepository;
    this.servicesRepository = servicesRepository;
  }

  async createBooking(bookingData) {
    const requiredFields = [
      'clientName',
      'clientEmail',
      'date',
      'time',
      'status'
    ];

    const missingFields = requiredFields.filter(
      field =>
        !(field in bookingData) ||
        bookingData[field] === undefined ||
        bookingData[field] === null ||
        (typeof bookingData[field] === 'string' && bookingData[field].trim() === '')
    );

    if (missingFields.length > 0) {
      throw new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
    }

    const bookings = await this.bookingsRepository.getAll();
    const newId =
      bookings.length > 0
        ? Math.max(...bookings.map(booking => Number(booking.id))) + 1
        : 1;

    const newBooking = {
      id: newId,
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status,
      services: []
    };

    return this.bookingsRepository.create(newBooking);
  }

  async getBookingById(id) {
    return this.bookingsRepository.getById(id);
  }

  async addServiceToBooking(bookingId, serviceId) {
    const booking = await this.bookingsRepository.getById(bookingId);

    if (!booking) {
      return {
        type: 'booking_not_found',
        data: null
      };
    }

    const service = await this.servicesRepository.getById(serviceId);

    if (!service) {
      return {
        type: 'service_not_found',
        data: null
      };
    }

    const numericServiceId = Number(serviceId);

    const existingService = booking.services.find(
      item => item.service === numericServiceId
    );

    if (existingService) {
      existingService.quantity += 1;
    } else {
      booking.services.push({
        service: numericServiceId,
        quantity: 1
      });
    }

    const updatedBooking = await this.bookingsRepository.update(
      bookingId,
      booking
    );

    return {
      type: 'success',
      data: updatedBooking
    };
  }
}

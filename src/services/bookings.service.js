import mongoose from 'mongoose';

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

    const newBooking = {
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
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return this.bookingsRepository.getById(id);
  }

  async addServiceToBooking(bookingId, serviceId) {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return { type: 'booking_not_found', data: null };
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return { type: 'service_not_found', data: null };
    }

    const booking = await this.bookingsRepository.getById(bookingId);

    if (!booking) {
      return { type: 'booking_not_found', data: null };
    }

    const service = await this.servicesRepository.getById(serviceId);

    if (!service) {
      return { type: 'service_not_found', data: null };
    }

    const existingService = booking.services.find(
      item => item.service.toString() === serviceId
    );

    if (existingService) {
      existingService.quantity += 1;
    } else {
      booking.services.push({
        service: serviceId,
        quantity: 1
      });
    }

    const updatedBooking = await this.bookingsRepository.update(
      bookingId,
      { services: booking.services }
    );

    return {
      type: 'success',
      data: updatedBooking
    };
  }
}

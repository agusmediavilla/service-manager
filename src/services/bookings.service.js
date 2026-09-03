import mongoose from 'mongoose';

export default class BookingsService {
  constructor(bookingsRepository, servicesRepository) {
    this.bookingsRepository = bookingsRepository;
    this.servicesRepository = servicesRepository;
  }

  async createBooking(data) {
    const requiredFields = [
      'clientName','clientEmail','date','time','status'
    ];

    const missing = requiredFields.filter(
      field =>
        !(field in data) ||
        data[field] === undefined ||
        data[field] === null ||
        (typeof data[field] === 'string' && data[field].trim() === '')
    );

    if (missing.length) {
      throw new Error(`Faltan campos obligatorios: ${missing.join(', ')}`);
    }

    return this.bookingsRepository.create({
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      date: data.date,
      time: data.time,
      status: data.status,
      services: []
    });
  }

  async getBookingById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return this.bookingsRepository.getById(id);
  }

  async getBookings() {
    return this.bookingsRepository.getAll();
  }

  async addServiceToBooking(bookingId, serviceId) {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return { type: 'booking_not_found', data: null };
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return { type: 'service_not_found', data: null };
    }

    const booking = await this.bookingsRepository.getById(bookingId);
    if (!booking) return { type: 'booking_not_found', data: null };

    const service = await this.servicesRepository.getById(serviceId);
    if (!service) return { type: 'service_not_found', data: null };

    const existing = booking.services.find(
      item => item.service.toString() === serviceId
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      booking.services.push({ service: serviceId, quantity: 1 });
    }

    const updated = await this.bookingsRepository.update(
      bookingId,
      { services: booking.services }
    );

    return { type: 'success', data: updated };
  }
}

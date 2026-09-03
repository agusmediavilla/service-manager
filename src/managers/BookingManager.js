import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class BookingManager {
  constructor(filePath = path.join(__dirname, '../data/bookings.json')) {
    this.path = filePath;
  }

  async _readBookings() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      if (!data.trim()) return [];
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(this.path, '[]', 'utf-8');
        return [];
      }
      throw error;
    }
  }

  async _writeBookings(bookings) {
    await fs.writeFile(
      this.path,
      JSON.stringify(bookings, null, 2),
      'utf-8'
    );
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

    const bookings = await this._readBookings();
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
      services: Array.isArray(bookingData.services) ? bookingData.services : []
    };

    bookings.push(newBooking);
    await this._writeBookings(bookings);

    return newBooking;
  }

  async getBookingById(id) {
    const bookings = await this._readBookings();
    const numericId = Number(id);
    return bookings.find(booking => booking.id === numericId) ?? null;
  }

  async addServiceToBooking(bookingId, serviceId) {
    const bookings = await this._readBookings();
    const numericBookingId = Number(bookingId);
    const numericServiceId = Number(serviceId);

    const index = bookings.findIndex(
      booking => booking.id === numericBookingId
    );

    if (index === -1) return null;

    const existingService = bookings[index].services.find(
      item => item.service === numericServiceId
    );

    if (existingService) {
      existingService.quantity += 1;
    } else {
      bookings[index].services.push({
        service: numericServiceId,
        quantity: 1
      });
    }

    await this._writeBookings(bookings);
    return bookings[index];
  }
}

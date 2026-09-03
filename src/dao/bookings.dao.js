import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class BookingsDAO {
  constructor(filePath = path.join(__dirname, '../data/bookings.json')) {
    this.path = filePath;
  }

  async _read() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return data.trim() ? JSON.parse(data) : [];
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(this.path, '[]', 'utf-8');
        return [];
      }
      throw error;
    }
  }

  async _write(bookings) {
    await fs.writeFile(this.path, JSON.stringify(bookings, null, 2), 'utf-8');
  }

  async create(booking) {
    const bookings = await this._read();
    bookings.push(booking);
    await this._write(bookings);
    return booking;
  }

  async getById(id) {
    const bookings = await this._read();
    return bookings.find(booking => booking.id === Number(id)) ?? null;
  }

  async update(id, updatedBooking) {
    const bookings = await this._read();
    const index = bookings.findIndex(booking => booking.id === Number(id));

    if (index === -1) return null;

    bookings[index] = updatedBooking;
    await this._write(bookings);

    return bookings[index];
  }

  async getAll() {
    return this._read();
  }
}

import BookingModel from '../models/booking.model.js';

export default class BookingsDAO {
  async create(bookingData) {
    const booking = await BookingModel.create(bookingData);
    return booking.toObject();
  }

  async getById(id) {
    return BookingModel.findById(id).lean();
  }

  async update(id, updatedData) {
    return BookingModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true
      }
    ).lean();
  }
}

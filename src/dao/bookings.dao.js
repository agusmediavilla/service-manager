import BookingModel from '../models/booking.model.js';

export default class BookingsDAO {
  async create(data) {
    const booking = await BookingModel.create(data);
    return booking.toObject();
  }

  async getById(id) {
    return BookingModel.findById(id)
      .populate({
        path: 'services.service',
        select: 'name description duration price category available'
      })
      .lean();
  }

  async getByIdRaw(id) {
    return BookingModel.findById(id).lean();
  }

  async update(id, data) {
    return BookingModel.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).lean();
  }
}

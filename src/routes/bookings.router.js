import { Router } from 'express';
import {
  createBooking,
  getBookingById,
  addServiceToBooking
} from '../controllers/bookings.controller.js';

import { validate } from '../middlewares/validate.middleware.js';
import {
  createBookingSchema,
  bookingServiceParamsSchema
} from '../validators/booking.validator.js';

const router = Router();

router.post('/', validate(createBookingSchema), createBooking);
router.get('/:bid', getBookingById);
router.post(
  '/:bid/services/:sid',
  validate(bookingServiceParamsSchema, 'params'),
  addServiceToBooking
);

export default router;

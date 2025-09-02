import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import {
  createBooking,
  getBookingById,
  listMyBookings,
  confirmBooking,
  cancelBooking,
  completeBooking
} from '../controllers/bookingController.js';

const router = Router();

router.use(requireAuth);          // sab protected

router.post('/', createBooking);  // customer
router.get('/me', listMyBookings);
router.get('/:id', getBookingById);

router.post('/:id/confirm', confirmBooking);   // provider/admin
router.post('/:id/cancel', cancelBooking);     // owner/admin
router.post('/:id/complete', completeBooking); // provider/admin

export default router;

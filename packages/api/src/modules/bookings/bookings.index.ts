import { createRouter } from '@/lib/create-app';
import * as handlers from './bookings.handler';
import * as routes from './bookings.route';

const router = createRouter();

router.openapi(routes.createBooking, handlers.createBooking);
router.openapi(routes.listBookings, handlers.listBookings);
router.openapi(routes.getBooking, handlers.getBooking);
router.openapi(routes.updateStatus, handlers.updateStatus);
router.openapi(routes.cancelBooking, handlers.cancelBooking);
router.openapi(routes.rescheduleBooking, handlers.rescheduleBooking);
router.openapi(routes.uploadCompletionPhoto, handlers.uploadCompletionPhoto);

export default router;

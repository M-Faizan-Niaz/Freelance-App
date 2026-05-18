import { createRouter } from '@/lib/create-app';
import { isAdminMiddleware } from '@/core/middlewares';

import * as handlers from './payments.handler';
import * as routes from './payments.route';

const router = createRouter();

// Only approve and reject require admin
router.use('/payments/:id/approve', isAdminMiddleware());
router.use('/payments/:id/reject', isAdminMiddleware());

// Static path /payments/booking/:bookingId must come before dynamic /payments/:id
router.openapi(routes.submitPayment, handlers.submitPayment);
router.openapi(routes.listPayments, handlers.listPayments);
router.openapi(routes.getPaymentByBooking, handlers.getPaymentByBooking);
router.openapi(routes.getPayment, handlers.getPayment);
router.openapi(routes.approvePayment, handlers.approvePayment);
router.openapi(routes.rejectPayment, handlers.rejectPayment);

export default router;

import { isAdminMiddleware } from '@/core/middlewares/is-admin-middleware';
import { createRouter } from '@/lib/create-app';

import * as handlers from './admin.handler';
import * as routes from './admin.route';

const router = createRouter();

router.use('*', isAdminMiddleware());

router.openapi(routes.getDashboard, handlers.getDashboard);
router.openapi(routes.getAdminProviders, handlers.getAdminProviders);
router.openapi(routes.getProviderDetail, handlers.getProviderDetail);
router.openapi(routes.verifyProvider, handlers.verifyProvider);
router.openapi(routes.getAdminCustomers, handlers.getAdminCustomers);
router.openapi(routes.suspendUser, handlers.suspendUser);
router.openapi(routes.banUser, handlers.banUser);
router.openapi(routes.unsuspendUser, handlers.unsuspendUser);
router.openapi(routes.getAdminBookings, handlers.getAdminBookings);
router.openapi(routes.assignBookingProvider, handlers.assignBookingProvider);
router.openapi(routes.refundBooking, handlers.refundBooking);
router.openapi(routes.getAdminPayments, handlers.getAdminPayments);
router.openapi(routes.getAdminPayouts, handlers.getAdminPayouts);
router.openapi(routes.approvePayout, handlers.approvePayout);
router.openapi(routes.getFraudFlags, handlers.getFraudFlags);
router.openapi(routes.updateFraudFlag, handlers.updateFraudFlag);
router.openapi(routes.getCommissionSettings, handlers.getCommissionSettings);
router.openapi(routes.updateCommissionSettings, handlers.updateCommissionSettings);
router.openapi(routes.getAnalytics, handlers.getAnalytics);

export default router;

import { createRouter } from '@/lib/create-app';
import { isAdminMiddleware } from '@/core/middlewares';

import * as handlers from './service-providers.handler';
import * as routes from './service-providers.route';

const router = createRouter();

// Authenticated provider routes — registered before /{id} to prevent
// "me" being swallowed by the numeric-id param route.
router.openapi(routes.getMyProfile, handlers.getMyProfile);
router.openapi(routes.updateMyProfile, handlers.updateMyProfile);
router.openapi(routes.uploadDocuments, handlers.uploadDocuments);
router.openapi(routes.uploadPortfolio, handlers.uploadPortfolio);
router.openapi(routes.deletePortfolio, handlers.deletePortfolio);

// Public routes
router.openapi(routes.listProviders, handlers.listProviders);
router.openapi(routes.listPortfolio, handlers.listPortfolio);
router.openapi(routes.getProviderById, handlers.getProviderById);

export default router;

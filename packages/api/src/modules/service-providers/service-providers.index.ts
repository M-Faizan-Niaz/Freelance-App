import { createRouter } from '@/lib/create-app';
import { isAdminMiddleware } from '@/core/middlewares';

import * as handlers from './service-providers.handler';
import * as routes from './service-providers.route';

const router = createRouter();

// Portfolio list is public; write routes require authentication (enforced in handlers)
router.openapi(routes.uploadDocuments, handlers.uploadDocuments);
router.openapi(routes.listPortfolio, handlers.listPortfolio);
router.openapi(routes.uploadPortfolio, handlers.uploadPortfolio);
router.openapi(routes.deletePortfolio, handlers.deletePortfolio);
router.openapi(routes.updateMyProfile, handlers.updateMyProfile);
router.openapi(routes.setMyCategories, handlers.setMyCategories);

export default router;

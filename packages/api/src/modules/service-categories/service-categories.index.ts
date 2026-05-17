import { createRouter } from '@/lib/create-app';
import { isAdminMiddleware } from '@/core/middlewares';
import * as handlers from './service-categories.handler';
import * as routes from './service-categories.route';

const router = createRouter();

// GET is public; POST and DELETE on /service-categories require admin
router.use('/service-categories', async (c, next) => {
  if (c.req.method === 'GET') return next();
  return isAdminMiddleware()(c, next);
});

// PATCH /service-categories/:id always requires admin
router.use('/service-categories/:id', isAdminMiddleware());
router.use('/service-categories/:id/image', isAdminMiddleware());

router.openapi(routes.list, handlers.list);
router.openapi(routes.create, handlers.create);
router.openapi(routes.patch, handlers.patch);
router.openapi(routes.removeSelected, handlers.removeSelected);
router.openapi(routes.uploadImage, handlers.uploadImage);

export default router;

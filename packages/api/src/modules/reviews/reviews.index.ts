import { createRouter } from '@/lib/create-app';

import * as handlers from './reviews.handler';
import * as routes from './reviews.route';

const router = createRouter();

router.openapi(routes.create, handlers.create);
router.openapi(routes.listByProvider, handlers.listByProvider);

export default router;

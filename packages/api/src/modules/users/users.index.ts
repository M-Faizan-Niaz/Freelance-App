import { createRouter } from '@/lib/create-app';

import * as handlers from './users.handler';
import * as routes from './users.route';

const router = createRouter();

router.openapi(routes.getMe, handlers.getMe);
router.openapi(routes.updateMe, handlers.updateMe);
router.openapi(routes.uploadProfilePhoto, handlers.uploadProfilePhoto);

export default router;

import { createRouter } from '@/lib/create-app';

import * as handlers from './notifications.handler';
import * as routes from './notifications.route';

const router = createRouter();

router.openapi(routes.list, handlers.list);
router.openapi(routes.markRead, handlers.markRead);
router.openapi(routes.markAllRead, handlers.markAllRead);

export default router;

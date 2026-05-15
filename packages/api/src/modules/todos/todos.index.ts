import { createRouter } from '@/lib/create-app';
import * as handlers from '@/modules/todos/todos.handler';
import * as routes from '@/modules/todos/todos.route';

const router = createRouter();

router.openapi(routes.list, handlers.list);
router.openapi(routes.create, handlers.create);
router.openapi(routes.patch, handlers.patch);
router.openapi(routes.remove, handlers.remove);

export default router;

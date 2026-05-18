import { createRouter } from '@/lib/create-app';

import * as handlers from './chat.handler';
import * as routes from './chat.route';

const router = createRouter();

router.openapi(routes.listConversations, handlers.listConversations);
router.openapi(routes.createOrGetConversation, handlers.createOrGetConversation);
router.openapi(routes.listMessages, handlers.listMessages);
router.openapi(routes.sendMessage, handlers.sendMessage);

export default router;

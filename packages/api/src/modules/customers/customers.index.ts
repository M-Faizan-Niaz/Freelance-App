import { createRouter } from '@/lib/create-app';

import * as handlers from './customers.handler';
import * as routes from './customers.route';

const router = createRouter();

router.openapi(routes.getMe, handlers.getMe);
router.openapi(routes.listAddresses, handlers.listAddresses);
router.openapi(routes.createAddress, handlers.createAddress);
router.openapi(routes.updateAddress, handlers.updateAddress);
router.openapi(routes.deleteAddress, handlers.deleteAddress);
router.openapi(routes.setDefaultAddress, handlers.setDefaultAddress);

export default router;

import { createRouter } from '~/lib/create-app'
import { DROPIN_CLASSES_HANDLER } from '~/routes/dropin-classes/dropin-classes.handler'
import { DROPIN_CLASSES_ROUTES } from '~/routes/dropin-classes/dropin-classes.routes'

const router = createRouter()
Object.entries(DROPIN_CLASSES_ROUTES).forEach(([key, route]) => {
  router.openapi(route, DROPIN_CLASSES_HANDLER[key as keyof typeof DROPIN_CLASSES_HANDLER])
})

export default router

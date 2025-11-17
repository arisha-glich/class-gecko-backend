import { createRouter } from '~/lib/create-app'
import { CLASSES_HANDLER } from '~/routes/classes/classes.handler'
import { CLASSES_ROUTES } from '~/routes/classes/classes.routes'

const router = createRouter()
Object.entries(CLASSES_ROUTES).forEach(([key, route]) => {
  router.openapi(route, CLASSES_HANDLER[key as keyof typeof CLASSES_HANDLER])
})

export default router

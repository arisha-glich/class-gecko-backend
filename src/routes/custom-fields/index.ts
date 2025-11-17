import { createRouter } from '~/lib/create-app'
import { CUSTOM_FIELDS_HANDLER } from '~/routes/custom-fields/custom-fields.handler'
import { CUSTOM_FIELDS_ROUTES } from '~/routes/custom-fields/custom-fields.routes'

const router = createRouter()
Object.entries(CUSTOM_FIELDS_ROUTES).forEach(([key, route]) => {
  router.openapi(route, CUSTOM_FIELDS_HANDLER[key as keyof typeof CUSTOM_FIELDS_HANDLER])
})

export default router

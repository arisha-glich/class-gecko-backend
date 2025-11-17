import { createRouter } from '~/lib/create-app'
import { TERMS_HANDLER } from '~/routes/terms/terms.handler'
import { TERMS_ROUTES } from '~/routes/terms/terms.routes'

const router = createRouter()
Object.entries(TERMS_ROUTES).forEach(([key, route]) => {
  router.openapi(route, TERMS_HANDLER[key as keyof typeof TERMS_HANDLER])
})

export default router

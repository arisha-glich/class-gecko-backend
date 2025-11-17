import { createRouter } from '~/lib/create-app'
import { WAIVERS_POLICIES_HANDLER } from '~/routes/waivers-policies/waivers-policies.handler'
import { WAIVERS_POLICIES_ROUTES } from '~/routes/waivers-policies/waivers-policies.routes'

const router = createRouter()
Object.entries(WAIVERS_POLICIES_ROUTES).forEach(([key, route]) => {
  router.openapi(route, WAIVERS_POLICIES_HANDLER[key as keyof typeof WAIVERS_POLICIES_HANDLER])
})

export default router

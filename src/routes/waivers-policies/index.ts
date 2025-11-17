import { createRouter } from '~/lib/create-app'
import { WAIVERS_POLICIES_HANDLER } from '~/routes/waivers-policies/waivers-policies.handler'
import { WAIVERS_POLICIES_ROUTES } from '~/routes/waivers-policies/waivers-policies.routes'

const router = createRouter()
;(Object.keys(WAIVERS_POLICIES_ROUTES) as Array<keyof typeof WAIVERS_POLICIES_ROUTES>).forEach(
  key => {
    // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
    router.openapi(WAIVERS_POLICIES_ROUTES[key], WAIVERS_POLICIES_HANDLER[key] as any)
  }
)

export default router

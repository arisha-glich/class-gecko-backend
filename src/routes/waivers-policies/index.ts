import { createRouter } from '~/lib/create-app'
import { WAIVERS_POLICIES_HANDLER } from '~/routes/waivers-policies/waivers-policies.handler'
import { WAIVERS_POLICIES_ROUTES } from '~/routes/waivers-policies/waivers-policies.routes'

const router = createRouter()
  .openapi(
    WAIVERS_POLICIES_ROUTES.createWaiverPolicy,
    WAIVERS_POLICIES_HANDLER.createWaiverPolicy
  )
  .openapi(
    WAIVERS_POLICIES_ROUTES.getWaiverPolicies,
    WAIVERS_POLICIES_HANDLER.getWaiverPolicies
  )
  .openapi(
    WAIVERS_POLICIES_ROUTES.getWaiverPolicy,
    WAIVERS_POLICIES_HANDLER.getWaiverPolicy
  )
  .openapi(
    WAIVERS_POLICIES_ROUTES.updateWaiverPolicy,
    WAIVERS_POLICIES_HANDLER.updateWaiverPolicy
  )
  .openapi(
    WAIVERS_POLICIES_ROUTES.deleteWaiverPolicy,
    WAIVERS_POLICIES_HANDLER.deleteWaiverPolicy
  )

export default router


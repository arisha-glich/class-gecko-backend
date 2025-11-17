import { createRouter } from '~/lib/create-app'
import { DISCOUNTS_HANDLER } from '~/routes/discounts/discounts.handler'
import { DISCOUNTS_ROUTES } from '~/routes/discounts/discounts.routes'

const router = createRouter()
  .openapi(DISCOUNTS_ROUTES.createDiscount, DISCOUNTS_HANDLER.createDiscount)
  .openapi(DISCOUNTS_ROUTES.getDiscounts, DISCOUNTS_HANDLER.getDiscounts)
  .openapi(DISCOUNTS_ROUTES.getDiscount, DISCOUNTS_HANDLER.getDiscount)
  .openapi(DISCOUNTS_ROUTES.updateDiscount, DISCOUNTS_HANDLER.updateDiscount)
  .openapi(DISCOUNTS_ROUTES.deleteDiscount, DISCOUNTS_HANDLER.deleteDiscount)

export default router

import { createRouter } from '~/lib/create-app'
import { DROPIN_CLASSES_HANDLER } from '~/routes/dropin-classes/dropin-classes.handler'
import { DROPIN_CLASSES_ROUTES } from '~/routes/dropin-classes/dropin-classes.routes'

const router = createRouter()
  .openapi(DROPIN_CLASSES_ROUTES.createDropInClass, DROPIN_CLASSES_HANDLER.createDropInClass)
  .openapi(DROPIN_CLASSES_ROUTES.getDropInClasses, DROPIN_CLASSES_HANDLER.getDropInClasses)
  .openapi(DROPIN_CLASSES_ROUTES.getDropInClass, DROPIN_CLASSES_HANDLER.getDropInClass)
  .openapi(DROPIN_CLASSES_ROUTES.updateDropInClass, DROPIN_CLASSES_HANDLER.updateDropInClass)
  .openapi(DROPIN_CLASSES_ROUTES.deleteDropInClass, DROPIN_CLASSES_HANDLER.deleteDropInClass)

export default router

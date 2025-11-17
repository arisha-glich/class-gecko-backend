import { createRouter } from '~/lib/create-app'
import { CLASSES_HANDLER } from '~/routes/classes/classes.handler'
import { CLASSES_ROUTES } from '~/routes/classes/classes.routes'

const router = createRouter()
  .openapi(CLASSES_ROUTES.createClass, CLASSES_HANDLER.createClass)
  .openapi(CLASSES_ROUTES.getClasses, CLASSES_HANDLER.getClasses)
  .openapi(CLASSES_ROUTES.getClassesByTerm, CLASSES_HANDLER.getClassesByTerm) // More specific route first
  .openapi(CLASSES_ROUTES.getClass, CLASSES_HANDLER.getClass)
  .openapi(CLASSES_ROUTES.updateClass, CLASSES_HANDLER.updateClass)
  .openapi(CLASSES_ROUTES.deleteClass, CLASSES_HANDLER.deleteClass)

export default router

import { createRouter } from '~/lib/create-app'
import { CUSTOM_FIELDS_HANDLER } from '~/routes/custom-fields/custom-fields.handler'
import { CUSTOM_FIELDS_ROUTES } from '~/routes/custom-fields/custom-fields.routes'

const router = createRouter()
  .openapi(CUSTOM_FIELDS_ROUTES.createCustomField, CUSTOM_FIELDS_HANDLER.createCustomField)
  .openapi(CUSTOM_FIELDS_ROUTES.getCustomFields, CUSTOM_FIELDS_HANDLER.getCustomFields)
  .openapi(CUSTOM_FIELDS_ROUTES.getCustomField, CUSTOM_FIELDS_HANDLER.getCustomField)
  .openapi(CUSTOM_FIELDS_ROUTES.updateCustomField, CUSTOM_FIELDS_HANDLER.updateCustomField)
  .openapi(CUSTOM_FIELDS_ROUTES.deleteCustomField, CUSTOM_FIELDS_HANDLER.deleteCustomField)

export default router


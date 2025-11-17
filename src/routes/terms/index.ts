import { createRouter } from '~/lib/create-app'
import { TERMS_HANDLER } from '~/routes/terms/terms.handler'
import { TERMS_ROUTES } from '~/routes/terms/terms.routes'

const router = createRouter()
  .openapi(TERMS_ROUTES.createTerm, TERMS_HANDLER.createTerm)
  .openapi(TERMS_ROUTES.getTerms, TERMS_HANDLER.getTerms)
  .openapi(TERMS_ROUTES.getTerm, TERMS_HANDLER.getTerm)
  .openapi(TERMS_ROUTES.updateTerm, TERMS_HANDLER.updateTerm)
  .openapi(TERMS_ROUTES.deleteTerm, TERMS_HANDLER.deleteTerm)

export default router

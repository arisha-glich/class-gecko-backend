import { createRouter } from '~/lib/create-app'
import { TRIALS_HANDLER } from '~/routes/trials/trials.handler'
import { TRIALS_ROUTES } from '~/routes/trials/trials.routes'

const router = createRouter()
  .openapi(TRIALS_ROUTES.createTrial, TRIALS_HANDLER.createTrial)
  .openapi(TRIALS_ROUTES.getTrials, TRIALS_HANDLER.getTrials)
  .openapi(TRIALS_ROUTES.getTrial, TRIALS_HANDLER.getTrial)
  .openapi(TRIALS_ROUTES.getTrialsByClass, TRIALS_HANDLER.getTrialsByClass)
  .openapi(TRIALS_ROUTES.updateTrial, TRIALS_HANDLER.updateTrial)
  .openapi(TRIALS_ROUTES.deleteTrial, TRIALS_HANDLER.deleteTrial)

export default router

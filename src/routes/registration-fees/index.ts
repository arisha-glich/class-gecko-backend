import { createRouter } from '~/lib/create-app'
import { REGISTRATION_FEES_HANDLER } from '~/routes/registration-fees/registration-fees.handler'
import { REGISTRATION_FEES_ROUTES } from '~/routes/registration-fees/registration-fees.routes'

const router = createRouter()
  .openapi(
    REGISTRATION_FEES_ROUTES.createRegistrationFee,
    REGISTRATION_FEES_HANDLER.createRegistrationFee
  )
  .openapi(
    REGISTRATION_FEES_ROUTES.getRegistrationFees,
    REGISTRATION_FEES_HANDLER.getRegistrationFees
  )
  .openapi(
    REGISTRATION_FEES_ROUTES.getRegistrationFee,
    REGISTRATION_FEES_HANDLER.getRegistrationFee
  )
  .openapi(
    REGISTRATION_FEES_ROUTES.updateRegistrationFee,
    REGISTRATION_FEES_HANDLER.updateRegistrationFee
  )
  .openapi(
    REGISTRATION_FEES_ROUTES.deleteRegistrationFee,
    REGISTRATION_FEES_HANDLER.deleteRegistrationFee
  )

export default router


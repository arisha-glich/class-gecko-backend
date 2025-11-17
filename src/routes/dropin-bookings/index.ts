import { createRouter } from '~/lib/create-app'
import { DROPIN_BOOKINGS_HANDLER } from '~/routes/dropin-bookings/dropin-bookings.handler'
import { DROPIN_BOOKINGS_ROUTES } from '~/routes/dropin-bookings/dropin-bookings.routes'

const router = createRouter()
  .openapi(
    DROPIN_BOOKINGS_ROUTES.createDropInBooking,
    DROPIN_BOOKINGS_HANDLER.createDropInBooking
  )
  .openapi(
    DROPIN_BOOKINGS_ROUTES.getDropInBookings,
    DROPIN_BOOKINGS_HANDLER.getDropInBookings
  )
  .openapi(
    DROPIN_BOOKINGS_ROUTES.getDropInBooking,
    DROPIN_BOOKINGS_HANDLER.getDropInBooking
  )
  .openapi(
    DROPIN_BOOKINGS_ROUTES.getDropInBookingsByClass,
    DROPIN_BOOKINGS_HANDLER.getDropInBookingsByClass
  )
  .openapi(
    DROPIN_BOOKINGS_ROUTES.updateDropInBooking,
    DROPIN_BOOKINGS_HANDLER.updateDropInBooking
  )
  .openapi(
    DROPIN_BOOKINGS_ROUTES.deleteDropInBooking,
    DROPIN_BOOKINGS_HANDLER.deleteDropInBooking
  )

export default router


import { createRouter } from '~/lib/create-app'
import { HOLIDAYS_HANDLER } from '~/routes/holidays/holidays.handler'
import { HOLIDAYS_ROUTES } from '~/routes/holidays/holidays.routes'

const router = createRouter()
  .openapi(HOLIDAYS_ROUTES.createHoliday, HOLIDAYS_HANDLER.createHoliday)
  .openapi(HOLIDAYS_ROUTES.getHolidays, HOLIDAYS_HANDLER.getHolidays)
  .openapi(HOLIDAYS_ROUTES.getHoliday, HOLIDAYS_HANDLER.getHoliday)
  .openapi(HOLIDAYS_ROUTES.updateHoliday, HOLIDAYS_HANDLER.updateHoliday)
  .openapi(HOLIDAYS_ROUTES.deleteHoliday, HOLIDAYS_HANDLER.deleteHoliday)

export default router


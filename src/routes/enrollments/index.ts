import { createRouter } from '~/lib/create-app'
import { ENROLLMENTS_HANDLER } from '~/routes/enrollments/enrollments.handler'
import { ENROLLMENTS_ROUTES } from '~/routes/enrollments/enrollments.routes'

const router = createRouter()
  .openapi(ENROLLMENTS_ROUTES.createEnrollment, ENROLLMENTS_HANDLER.createEnrollment)
  .openapi(ENROLLMENTS_ROUTES.getEnrollments, ENROLLMENTS_HANDLER.getEnrollments)
  .openapi(ENROLLMENTS_ROUTES.getEnrollment, ENROLLMENTS_HANDLER.getEnrollment)
  .openapi(ENROLLMENTS_ROUTES.getEnrollmentsByClass, ENROLLMENTS_HANDLER.getEnrollmentsByClass)
  .openapi(ENROLLMENTS_ROUTES.updateEnrollment, ENROLLMENTS_HANDLER.updateEnrollment)
  .openapi(ENROLLMENTS_ROUTES.deleteEnrollment, ENROLLMENTS_HANDLER.deleteEnrollment)

export default router

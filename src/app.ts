import campsRouter from '~/routes/camps'
import classesRouter from '~/routes/classes'
import customFieldsRouter from '~/routes/custom-fields'
import discountsRouter from '~/routes/discounts'
import dropInBookingsRouter from '~/routes/dropin-bookings'
import dropInClassesRouter from '~/routes/dropin-classes'
import dropInLessonsRouter from '~/routes/dropin-lessons'
import enrollmentsRouter from '~/routes/enrollments'
import familiesRouter from '~/routes/families'
import holidaysRouter from '~/routes/holidays'
import lessonsRouter from '~/routes/lessons'
import locationsRouter from '~/routes/locations'
import organizationRouter from '~/routes/organization'
import registrationFeesRouter from '~/routes/registration-fees'
import studentsRouter from '~/routes/students'
import termsRouter from '~/routes/terms'
import router from '~/routes/test'
import trialsRouter from '~/routes/trials'
import waitlistRouter from '~/routes/waitlist'
import waiversPoliciesRouter from '~/routes/waivers-policies'
import type { AppOpenAPI } from '~/types'

export function registerRoutes(app: AppOpenAPI) {
  app.route('/test', router)
  app.route('/organization', organizationRouter)
  app.route('/terms', termsRouter)
  app.route('/camps', campsRouter)
  app.route('/dropin-classes', dropInClassesRouter)
  app.route('/dropin-bookings', dropInBookingsRouter)
  app.route('/dropin-lessons', dropInLessonsRouter)
  app.route('/families', familiesRouter)
  app.route('/classes', classesRouter)
  app.route('/lessons', lessonsRouter)
  app.route('/enrollments', enrollmentsRouter)
  app.route('/trials', trialsRouter)
  app.route('/waitlist', waitlistRouter)
  app.route('/students', studentsRouter)
  app.route('/discounts', discountsRouter)
  app.route('/registration-fees', registrationFeesRouter)
  app.route('/custom-fields', customFieldsRouter)
  app.route('/holidays', holidaysRouter)
  app.route('/locations', locationsRouter)
  app.route('/waivers-policies', waiversPoliciesRouter)
  return app
}

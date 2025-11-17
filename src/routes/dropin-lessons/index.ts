import { createRouter } from '~/lib/create-app'
import { DROPIN_LESSONS_HANDLER } from '~/routes/dropin-lessons/dropin-lessons.handler'
import { DROPIN_LESSONS_ROUTES } from '~/routes/dropin-lessons/dropin-lessons.routes'

const router = createRouter()
  .openapi(
    DROPIN_LESSONS_ROUTES.createDropInLesson,
    DROPIN_LESSONS_HANDLER.createDropInLesson
  )
  .openapi(
    DROPIN_LESSONS_ROUTES.getDropInLessons,
    DROPIN_LESSONS_HANDLER.getDropInLessons
  )
  .openapi(
    DROPIN_LESSONS_ROUTES.getDropInLesson,
    DROPIN_LESSONS_HANDLER.getDropInLesson
  )
  .openapi(
    DROPIN_LESSONS_ROUTES.getDropInLessonsByClass,
    DROPIN_LESSONS_HANDLER.getDropInLessonsByClass
  )
  .openapi(
    DROPIN_LESSONS_ROUTES.updateDropInLesson,
    DROPIN_LESSONS_HANDLER.updateDropInLesson
  )
  .openapi(
    DROPIN_LESSONS_ROUTES.deleteDropInLesson,
    DROPIN_LESSONS_HANDLER.deleteDropInLesson
  )

export default router


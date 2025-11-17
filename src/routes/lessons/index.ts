import { createRouter } from '~/lib/create-app'
import { LESSONS_HANDLER } from '~/routes/lessons/lessons.handler'
import { LESSONS_ROUTES } from '~/routes/lessons/lessons.routes'

const router = createRouter()
  .openapi(LESSONS_ROUTES.createLesson, LESSONS_HANDLER.createLesson)
  .openapi(LESSONS_ROUTES.getLessons, LESSONS_HANDLER.getLessons)
  .openapi(LESSONS_ROUTES.getLesson, LESSONS_HANDLER.getLesson)
  .openapi(LESSONS_ROUTES.getLessonsByClass, LESSONS_HANDLER.getLessonsByClass)
  .openapi(LESSONS_ROUTES.updateLesson, LESSONS_HANDLER.updateLesson)
  .openapi(LESSONS_ROUTES.deleteLesson, LESSONS_HANDLER.deleteLesson)

export default router

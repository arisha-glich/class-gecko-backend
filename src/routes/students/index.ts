import { createRouter } from '~/lib/create-app'
import { STUDENTS_HANDLER } from '~/routes/students/students.handler'
import { STUDENTS_ROUTES } from '~/routes/students/students.routes'

const router = createRouter()
;(Object.keys(STUDENTS_ROUTES) as Array<keyof typeof STUDENTS_ROUTES>).forEach(key => {
  // biome-ignore lint/suspicious/noExplicitAny: HandlerMapFromRoutes ensures type safety
  router.openapi(STUDENTS_ROUTES[key], STUDENTS_HANDLER[key] as any)
})

export default router

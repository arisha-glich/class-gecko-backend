import { createRouter } from '~/lib/create-app'
import { STUDENTS_HANDLER } from '~/routes/students/students.handler'
import { STUDENTS_ROUTES } from '~/routes/students/students.routes'

const router = createRouter()
Object.entries(STUDENTS_ROUTES).forEach(([key, route]) => {
  router.openapi(route, STUDENTS_HANDLER[key as keyof typeof STUDENTS_HANDLER])
})

export default router

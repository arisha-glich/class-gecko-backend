import { createRouter } from '~/lib/create-app'
import { STUDENTS_HANDLER } from '~/routes/students/students.handler'
import { STUDENTS_ROUTES } from '~/routes/students/students.routes'

const router = createRouter()
  .openapi(STUDENTS_ROUTES.getStudents, STUDENTS_HANDLER.getStudents)
  .openapi(STUDENTS_ROUTES.getStudent, STUDENTS_HANDLER.getStudent)
  .openapi(STUDENTS_ROUTES.getStudentsByFamily, STUDENTS_HANDLER.getStudentsByFamily)
  .openapi(STUDENTS_ROUTES.updateStudent, STUDENTS_HANDLER.updateStudent)
  .openapi(STUDENTS_ROUTES.deleteStudent, STUDENTS_HANDLER.deleteStudent)

export default router

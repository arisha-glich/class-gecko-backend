import { createRouter } from '~/lib/create-app'
import { LESSONS_HANDLER } from '~/routes/lessons/lessons.handler'
import { LESSONS_ROUTES } from '~/routes/lessons/lessons.routes'

const router = createRouter()
Object.entries(LESSONS_ROUTES).forEach(([key, route]) => {
  router.openapi(route, LESSONS_HANDLER[key as keyof typeof LESSONS_HANDLER])
})

export default router

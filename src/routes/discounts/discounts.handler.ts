import * as HttpStatusCodes from 'stoker/http-status-codes'
import type { DISCOUNTS_ROUTES } from '~/routes/discounts/discounts.routes'
import * as discountsService from '~/services/discounts.service'
import type { HandlerMapFromRoutes } from '~/types'

export const DISCOUNTS_HANDLER: HandlerMapFromRoutes<typeof DISCOUNTS_ROUTES> = {
  createDiscount: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }
    const body = await c.req.valid('json')
    try {
      const discount = await discountsService.createDiscount({
        userId: authUser.id,
        ...body,
      })
      return c.json(
        { message: 'Discount created successfully', success: true, data: discount },
        HttpStatusCodes.CREATED
      )
    } catch (error) {
      console.error('Error creating discount:', error)
      return c.json({ message: 'Failed to create discount' }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
    }
  },

  getDiscounts: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }
    const discounts = await discountsService.getDiscounts(authUser.id)
    return c.json(
      { message: 'Discounts retrieved successfully', success: true, data: discounts },
      HttpStatusCodes.OK
    )
  },

  getDiscount: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }
    const { id } = c.req.valid('param')
    const discount = await discountsService.getDiscountById(Number(id), authUser.id)
    if (!discount) {
      return c.json({ message: 'Discount not found' }, HttpStatusCodes.NOT_FOUND)
    }
    return c.json(
      { message: 'Discount retrieved successfully', success: true, data: discount },
      HttpStatusCodes.OK
    )
  },

  updateDiscount: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }
    const { id } = c.req.valid('param')
    const body = await c.req.valid('json')
    const discount = await discountsService.updateDiscount(Number(id), authUser.id, body)
    if (!discount) {
      return c.json({ message: 'Discount not found' }, HttpStatusCodes.NOT_FOUND)
    }
    return c.json(
      { message: 'Discount updated successfully', success: true, data: discount },
      HttpStatusCodes.OK
    )
  },

  deleteDiscount: async c => {
    const authUser = c.get('user')
    if (!authUser) {
      return c.json({ message: 'Unauthorized' }, HttpStatusCodes.UNAUTHORIZED)
    }
    const { id } = c.req.valid('param')
    const deleted = await discountsService.deleteDiscount(Number(id), authUser.id)
    if (!deleted) {
      return c.json({ message: 'Discount not found' }, HttpStatusCodes.NOT_FOUND)
    }
    return c.json(
      { message: 'Discount deleted successfully', success: true, data: { success: true } },
      HttpStatusCodes.OK
    )
  },
}

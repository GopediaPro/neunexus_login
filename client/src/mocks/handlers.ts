import { productHandlers } from './api/product'
import { orderHandlers } from './api/order'
import { macroHandlers } from './api/macro'

export const handlers = [
  ...productHandlers,
  ...orderHandlers,
  ...macroHandlers,
]

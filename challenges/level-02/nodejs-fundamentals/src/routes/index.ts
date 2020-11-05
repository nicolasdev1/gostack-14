import { Router } from 'express'
import transactions from './transaction.routes'

const routes = Router()

routes.use('/transactions', transactions)

export default routes
